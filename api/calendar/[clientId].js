import { google } from 'googleapis';
import { getClient, upsertClient } from '../lib/store.js';
import { createOAuth2Client } from '../lib/google.js';

/**
 * Extract parameters and toolCallId from VAPI tool call or direct request.
 * VAPI sends: { message: { type: "tool-calls", toolCallList: [...], toolWithToolCallList: [...] } }
 */
function extractParams(req) {
  const body = req.body || {};
  const msg = body.message || {};

  // VAPI tool-calls format (toolCallList)
  if (msg.toolCallList?.[0]) {
    const tc = msg.toolCallList[0];
    return {
      params: tc.parameters || {},
      toolCallId: tc.id,
      toolName: tc.name,
    };
  }
  // VAPI tool-calls format (toolWithToolCallList)
  if (msg.toolWithToolCallList?.[0]?.toolCall) {
    const tc = msg.toolWithToolCallList[0].toolCall;
    return {
      params: tc.parameters || {},
      toolCallId: tc.id,
      toolName: msg.toolWithToolCallList[0].name,
    };
  }
  // VAPI older function-call format
  if (msg.functionCall?.parameters) {
    return { params: msg.functionCall.parameters, toolCallId: null, toolName: null };
  }
  // Direct API call
  return { params: body, toolCallId: null, toolName: null };
}

function vapiResponse(result, toolCallId, toolName) {
  const resultStr = typeof result === 'string' ? result : JSON.stringify(result).replace(/\n/g, ' ');
  if (toolCallId) {
    return { results: [{ toolCallId, name: toolName, result: resultStr }] };
  }
  return { results: [{ result: resultStr }] };
}

// ---- Google Sheets helpers (lazy-loaded to avoid crashing availability) ----
const SHEET_NAME = 'Sol-IA Llamadas';
const HEADERS = ['Fecha', 'Hora', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Notas'];

async function getOrCreateSheet(auth, client) {
  let sheets;
  try {
    sheets = google.sheets({ version: 'v4', auth });
  } catch (err) {
    throw new Error(`Sheets API init failed: ${err.message}`);
  }

  const sheetId = client.sheetId;
  if (sheetId) {
    try {
      await sheets.spreadsheets.get({ spreadsheetId: sheetId });
      return sheetId;
    } catch (_) {
      // Sheet was deleted or inaccessible, create a new one
    }
  }

  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: { title: `${client.business} - Sol-IA Contactos` },
      sheets: [{ properties: { title: SHEET_NAME } }],
    },
  });

  const newSheetId = spreadsheet.data.spreadsheetId;

  await sheets.spreadsheets.values.update({
    spreadsheetId: newSheetId,
    range: `${SHEET_NAME}!A1:G1`,
    valueInputOption: 'RAW',
    resource: { values: [HEADERS] },
  });

  await upsertClient(client.id, { sheetId: newSheetId });
  console.log(`Created sheet ${newSheetId} for client ${client.id}`);
  return newSheetId;
}

async function appendToSheet(auth, client, data) {
  const sheetId = await getOrCreateSheet(auth, client);
  const sheets = google.sheets({ version: 'v4', auth });

  const now = new Date();
  const row = [
    now.toLocaleDateString('es-CL'),
    now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    data.caller_name || '',
    data.caller_email || '',
    data.caller_phone || '',
    data.type || 'Llamada',
    data.notes || (data.date ? `Cita: ${data.date} ${data.time || ''}` : ''),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A:G`,
    valueInputOption: 'RAW',
    resource: { values: [row] },
  });
}

// ---- Availability handler (isolated to prevent sheet errors from crashing it) ----
async function handleAvailability(req, res, oauth2Client, clientId) {
  const { params, toolCallId, toolName } = extractParams(req);
  console.log(`[availability] FULL REQUEST BODY: ${JSON.stringify(req.body)}`);
  console.log(`[availability] clientId=${clientId}, params=${JSON.stringify(params)}, query=${JSON.stringify(req.query)}, toolCallId=${toolCallId}`);

  const datesParam = req.query.dates || req.query.date || params.dates || params.date;
  if (!datesParam) {
    return res.json(vapiResponse('No se proporcionaron fechas. Usa el parámetro dates con formato YYYY-MM-DD.', toolCallId, toolName));
  }

  const dates = String(datesParam).split(',').map(d => d.trim()).filter(Boolean).slice(0, 5);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const allAvailability = {};

  for (const date of dates) {
    try {
      // Parse date and create times in Santiago timezone
      const [year, month, day] = date.split('-').map(Number);
      const timeMin = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)); // 09:00 Santiago = 12:00 UTC
      const timeMax = new Date(Date.UTC(year, month - 1, day, 21, 0, 0)); // 18:00 Santiago = 21:00 UTC

      if (isNaN(timeMin.getTime()) || isNaN(timeMax.getTime())) {
        console.error(`[availability] Invalid date: ${date}`);
        continue;
      }

      console.log(`[availability] Checking ${date}: ${timeMin.toISOString()} to ${timeMax.toISOString()}`);

      const response = await calendar.freebusy.query({
        resource: {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          timeZone: 'America/Santiago',
          items: [{ id: 'primary' }],
        },
      });

      const busySlots = response.data.calendars?.primary?.busy || [];
      const errors = response.data.calendars?.primary?.errors;
      if (errors) console.warn(`[availability] Calendar errors for ${date}:`, JSON.stringify(errors));

      const availableSlots = [];
      let current = new Date(timeMin);
      while (current < timeMax) {
        const next = new Date(current.getTime() + 60 * 60 * 1000);
        const isBusy = busySlots.some((b) => current < new Date(b.end) && next > new Date(b.start));
        if (!isBusy) {
          // Format as HH:MM in Chile time
            availableSlots.push(current.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Santiago' }));
        }
        current = next;
      }
      if (availableSlots.length > 0) {
        allAvailability[date] = availableSlots;
      }
    } catch (err) {
      console.error(`[availability] Error for date ${date}:`, err.message);
    }
  }

  console.log(`[availability] Result:`, JSON.stringify(allAvailability));
  if (Object.keys(allAvailability).length === 0) {
    return res.json(vapiResponse(`No hay horarios disponibles en las fechas consultadas.`, toolCallId, toolName));
  }
  
  // Format as plain text list for the agent to read
  let responseText = 'Horarios disponibles:\n';
  for (const [date, slots] of Object.entries(allAvailability)) {
    responseText += `${date}: ${slots.join(', ')}\n`;
  }
  
  return res.json(vapiResponse(responseText, toolCallId, toolName));
}

// ---- Main handler ----
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { clientId } = req.query;
  const action = req.query.action;

  console.log(`[calendar] clientId=${clientId}, action=${action}, method=${req.method}`);

  // Quick health check
  if (action === 'ping') {
    return res.json({ ok: true, clientId, ts: Date.now() });
  }

  try {
    const client = await getClient(clientId);
    if (!client || !client.tokens) {
      console.error(`[calendar] No client or tokens for: ${clientId}`);
      const { toolCallId, toolName } = extractParams(req);
      return res.json(vapiResponse('Cliente no conectado a Google Calendar. Pide al cliente que conecte su calendario primero.', toolCallId, toolName));
    }

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(client.tokens);

    // Save refreshed tokens
    oauth2Client.on('tokens', async (newTokens) => {
      console.log(`[calendar] Tokens refreshed for ${clientId}`);
      try {
        await upsertClient(clientId, { tokens: { ...client.tokens, ...newTokens } });
      } catch (e) {
        console.error('[calendar] Token save error:', e.message);
      }
    });

    // ---- AVAILABILITY ----
    if (action === 'availability') {
      return await handleAvailability(req, res, oauth2Client, clientId);
    }

    // ---- SCHEDULE ----
    if (action === 'schedule') {
      const { params, toolCallId, toolName } = extractParams(req);
      console.log(`[schedule] params=${JSON.stringify(params)}`);
      const { date, time, caller_name, caller_email, caller_phone } = params;
      if (!date || !time) {
        return res.json(vapiResponse('Se requiere fecha (date) y hora (time) para agendar.', toolCallId, toolName));
      }

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const startTime = new Date(`${date}T${time}:00-03:00`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const event = {
        summary: `Cita: ${caller_name || 'Cliente'}`,
        description: `Agendado por Sol-IA\nNombre: ${caller_name || 'N/A'}\nEmail: ${caller_email || 'N/A'}\nTeléfono: ${caller_phone || 'N/A'}`,
        start: { dateTime: startTime.toISOString(), timeZone: 'America/Santiago' },
        end: { dateTime: endTime.toISOString(), timeZone: 'America/Santiago' },
        attendees: caller_email ? [{ email: caller_email }] : [],
      };

      const result = await calendar.events.insert({ calendarId: 'primary', resource: event, sendUpdates: 'all' });

      // Log to sheet (non-blocking, don't crash if sheets fails)
      try {
        await appendToSheet(oauth2Client, client, { caller_name, caller_email, caller_phone, date, time, type: 'Cita agendada' });
      } catch (err) {
        console.error('[schedule] Sheet log error:', err.message);
      }

      return res.json(vapiResponse({ success: true, message: `Cita agendada para ${caller_name || 'cliente'} el ${date} a las ${time}`, event_link: result.data.htmlLink }, toolCallId, toolName));
    }

    // ---- SAVE CALLER ----
    if (action === 'saveCaller') {
      const { params, toolCallId, toolName } = extractParams(req);
      const { caller_name, caller_email, caller_phone, notes } = params;

      try {
        await appendToSheet(oauth2Client, client, { caller_name, caller_email, caller_phone, notes, type: 'Llamada' });
        return res.json(vapiResponse({ success: true, message: `Contacto ${caller_name || 'desconocido'} guardado` }, toolCallId, toolName));
      } catch (err) {
        console.error('[saveCaller] Sheet error:', err.message);
        return res.json(vapiResponse({ error: `No se pudo guardar: ${err.message}` }, toolCallId, toolName));
      }
    }

    // ---- DEBUG ----
    if (action === 'debug') {
      const tokenInfo = {
        hasAccessToken: !!client.tokens.access_token,
        hasRefreshToken: !!client.tokens.refresh_token,
        tokenType: client.tokens.token_type,
        expiryDate: client.tokens.expiry_date ? new Date(client.tokens.expiry_date).toISOString() : 'none',
        scope: client.tokens.scope,
      };

      let calendarTest = 'not tested';
      try {
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const list = await calendar.calendarList.list({ maxResults: 1 });
        calendarTest = `OK - found ${list.data.items?.length || 0} calendars, primary: ${list.data.items?.[0]?.id}`;
      } catch (err) {
        calendarTest = `FAILED: ${err.message}`;
      }

      return res.json({ clientId, tokenInfo, calendarTest, sheetId: client.sheetId || null });
    }

    const { toolCallId, toolName } = extractParams(req);
    return res.json(vapiResponse('Acción no válida. Usa: availability, schedule, saveCaller, debug', toolCallId, toolName));
  } catch (error) {
    console.error(`[calendar] FATAL:`, error.message, error.stack);
    // Always return valid JSON so VAPI doesn't hang
    try {
      const { toolCallId, toolName } = extractParams(req);
      return res.json(vapiResponse(`Error interno: ${error.message}`, toolCallId, toolName));
    } catch (_) {
      return res.status(200).json({ results: [{ result: `Error: ${error.message}` }] });
    }
  }
}
