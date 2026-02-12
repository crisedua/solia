import { google } from 'googleapis';
import { getClient, upsertClient } from '../lib/store.js';
import { createOAuth2Client } from '../lib/google.js';

/**
 * Extract parameters and toolCallId from VAPI tool call or direct request.
 * VAPI sends: { message: { type: "tool-calls", toolCallList: [{ id, name, parameters }] } }
 */
function extractParams(req) {
  const body = req.body || {};
  // VAPI tool-calls format
  if (body.message?.toolCallList?.[0]?.parameters) {
    return {
      params: body.message.toolCallList[0].parameters,
      toolCallId: body.message.toolCallList[0].id,
      toolName: body.message.toolCallList[0].name,
    };
  }
  // VAPI older function-call format
  if (body.message?.functionCall?.parameters) {
    return { params: body.message.functionCall.parameters, toolCallId: null, toolName: null };
  }
  // Direct API call
  return { params: body, toolCallId: null, toolName: null };
}

function vapiResponse(result, toolCallId, toolName) {
  if (toolCallId) {
    return { results: [{ toolCallId, name: toolName, result: JSON.stringify(result) }] };
  }
  return { results: [{ result }] };
}

/**
 * Get an authenticated calendar client, handling token refresh.
 */
async function getCalendarClient(clientId, tokens) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // Listen for token refresh and save new tokens
  oauth2Client.on('tokens', async (newTokens) => {
    console.log('Tokens refreshed for client:', clientId);
    const updated = { ...tokens, ...newTokens };
    try {
      await upsertClient(clientId, { tokens: updated });
    } catch (err) {
      console.error('Failed to save refreshed tokens:', err.message);
    }
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { clientId } = req.query;
  const action = req.query.action;

  console.log(`Calendar request: clientId=${clientId}, action=${action}, method=${req.method}`);

  try {
    const client = await getClient(clientId);
    if (!client || !client.tokens) {
      console.error('Client not found or no tokens:', clientId);
      return res.json({ results: [{ error: 'Client not connected to Google Calendar' }] });
    }

    const calendar = await getCalendarClient(clientId, client.tokens);

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
      return res.json(vapiResponse({ success: true, message: `Cita agendada para ${caller_name || 'cliente'} el ${date} a las ${time}`, event_link: result.data.htmlLink }, toolCallId, toolName));
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
