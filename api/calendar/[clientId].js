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
  // VAPI requires result to be a single-line string
  const resultStr = typeof result === 'string' ? result : JSON.stringify(result).replace(/\n/g, ' ');
  if (toolCallId) {
    return { results: [{ toolCallId, name: toolName, result: resultStr }] };
  }
  return { results: [{ result: resultStr }] };
}

const SHEET_NAME = 'Sol-IA Llamadas';
const HEADERS = ['Fecha', 'Hora', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Notas'];

async function getOrCreateSheet(auth, client) {
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = client.sheetId;

  // If we already have a sheet ID, verify it exists
  if (sheetId) {
    try {
      await sheets.spreadsheets.get({ spreadsheetId: sheetId });
      return sheetId;
    } catch (e) {
      // Sheet was deleted, create a new one
    }
  }

  // Create new spreadsheet
  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: { title: `${client.business} - Sol-IA Contactos` },
      sheets: [{ properties: { title: SHEET_NAME } }],
    },
  });

  const newSheetId = spreadsheet.data.spreadsheetId;

  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: newSheetId,
    range: `${SHEET_NAME}!A1:G1`,
    valueInputOption: 'RAW',
    resource: { values: [HEADERS] },
  });

  // Save sheet ID to client record
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
    data.notes || data.date ? `Cita: ${data.date} ${data.time || ''}` : '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A:G`,
    valueInputOption: 'RAW',
    resource: { values: [row] },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { clientId } = req.query;
  const action = req.query.action;

  console.log(`Calendar request: clientId=${clientId}, action=${action}, method=${req.method}, body=${JSON.stringify(req.body).slice(0, 500)}`);

  try {
    const client = await getClient(clientId);
    if (!client || !client.tokens) {
      console.error('Client not found or no tokens:', clientId);
      return res.json({ results: [{ error: 'Client not connected to Google Calendar' }] });
    }

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(client.tokens);

    // Listen for token refresh
    oauth2Client.on('tokens', async (newTokens) => {
      console.log('Tokens refreshed for client:', clientId);
      try { await upsertClient(clientId, { tokens: { ...client.tokens, ...newTokens } }); } catch (e) { console.error('Token save error:', e.message); }
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Availability (supports multiple dates)
    if (action === 'availability') {
      const { params, toolCallId, toolName } = extractParams(req);
      console.log('Availability raw body:', JSON.stringify(req.body));
      console.log('Availability params:', JSON.stringify(params));
      const datesParam = req.query.dates || req.query.date || params.dates || params.date;
      if (!datesParam) {
        return res.json(vapiResponse({ error: 'dates parameter required' }, toolCallId, toolName));
      }

      const dates = String(datesParam).split(',').map(d => d.trim()).filter(Boolean).slice(0, 5);
      const allAvailability = {};

      for (const date of dates) {
        try {
          const timeMin = new Date(`${date}T09:00:00`);
          const timeMax = new Date(`${date}T18:00:00`);

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
          console.log(`Date ${date}: timeMin=${timeMin.toISOString()}, timeMax=${timeMax.toISOString()}, busy=${JSON.stringify(busySlots)}, errors=${JSON.stringify(errors)}`);
          const availableSlots = [];
          let current = new Date(timeMin);
          while (current < timeMax) {
            const next = new Date(current.getTime() + 60 * 60 * 1000);
            const isBusy = busySlots.some((b) => current < new Date(b.end) && next > new Date(b.start));
            if (!isBusy) availableSlots.push(current.toTimeString().slice(0, 5));
            current = next;
          }
          if (availableSlots.length > 0) {
            allAvailability[date] = availableSlots;
          }
        } catch (err) {
          console.error(`Error checking date ${date}:`, err.message);
        }
      }

      console.log('Availability result:', JSON.stringify(allAvailability));
      if (Object.keys(allAvailability).length === 0) {
        return res.json(vapiResponse({ message: 'No hay horarios disponibles en las fechas consultadas', dates_checked: dates }, toolCallId, toolName));
      }
      return res.json(vapiResponse(allAvailability, toolCallId, toolName));
    }

    // Schedule
    if (action === 'schedule') {
      const { params, toolCallId, toolName } = extractParams(req);
      console.log('Schedule params:', JSON.stringify(params));
      const { date, time, caller_name, caller_email, caller_phone } = params;
      if (!date || !time) {
        return res.json(vapiResponse({ error: 'date and time required' }, toolCallId, toolName));
      }

      const startTime = new Date(`${date}T${time}:00`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const event = {
        summary: `Cita: ${caller_name || 'Cliente'}`,
        description: `Agendado por Sol-IA\nNombre: ${caller_name || 'N/A'}\nEmail: ${caller_email || 'N/A'}\nTeléfono: ${caller_phone || 'N/A'}`,
        start: { dateTime: startTime.toISOString(), timeZone: 'America/Santiago' },
        end: { dateTime: endTime.toISOString(), timeZone: 'America/Santiago' },
        attendees: caller_email ? [{ email: caller_email }] : [],
      };

      const result = await calendar.events.insert({ calendarId: 'primary', resource: event, sendUpdates: 'all' });

      // Also log to Google Sheet
      try {
        await appendToSheet(oauth2Client, client, { caller_name, caller_email, caller_phone, date, time, type: 'Cita agendada' });
      } catch (err) {
        console.error('Sheet log error:', err.message);
      }

      return res.json(vapiResponse({ success: true, message: `Cita agendada para ${caller_name || 'cliente'} el ${date} a las ${time}`, event_link: result.data.htmlLink }, toolCallId, toolName));
    }

    // Save caller to Google Sheet
    if (action === 'saveCaller') {
      const { params, toolCallId, toolName } = extractParams(req);
      const { caller_name, caller_email, caller_phone, notes } = params;

      try {
        await appendToSheet(oauth2Client, client, { caller_name, caller_email, caller_phone, notes, type: 'Llamada' });
        return res.json(vapiResponse({ success: true, message: `Contacto ${caller_name || 'desconocido'} guardado en la hoja de cálculo` }, toolCallId, toolName));
      } catch (err) {
        console.error('Sheet save error:', err.message);
        return res.json(vapiResponse({ error: `No se pudo guardar: ${err.message}` }, toolCallId, toolName));
      }
    }

    // Debug endpoint
    if (action === 'debug') {
      const tokenInfo = {
        hasAccessToken: !!client.tokens.access_token,
        hasRefreshToken: !!client.tokens.refresh_token,
        tokenType: client.tokens.token_type,
        expiryDate: client.tokens.expiry_date ? new Date(client.tokens.expiry_date).toISOString() : 'none',
        scope: client.tokens.scope,
      };

      // Try a simple calendar list call to test auth
      let calendarTest = 'not tested';
      try {
        const list = await calendar.calendarList.list({ maxResults: 1 });
        calendarTest = `OK - found ${list.data.items?.length || 0} calendars, primary: ${list.data.items?.[0]?.id}`;
      } catch (err) {
        calendarTest = `FAILED: ${err.message}`;
      }

      return res.json({ clientId, tokenInfo, calendarTest });
    }

    return res.json({ results: [{ error: 'Invalid action' }] });
  } catch (error) {
    console.error('Calendar error:', error.message, error.stack);
    return res.json({ results: [{ error: `Calendar error: ${error.message}` }] });
  }
}
