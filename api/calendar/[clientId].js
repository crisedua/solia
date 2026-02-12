import { google } from 'googleapis';
import { getClient, upsertClient } from '../lib/store.js';
import { createOAuth2Client } from '../lib/google.js';

/**
 * Extract parameters from VAPI tool call or direct request.
 * VAPI sends: { message: { type: "function-call", functionCall: { name, parameters } } }
 */
function extractParams(req) {
  const body = req.body || {};
  if (body.message?.functionCall?.parameters) {
    return body.message.functionCall.parameters;
  }
  return body;
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
      const params = extractParams(req);
      console.log('Availability params:', JSON.stringify(params));
      const datesParam = req.query.dates || req.query.date || params.dates || params.date;
      if (!datesParam) {
        return res.json({ results: [{ error: 'dates parameter required' }] });
      }

      const dates = String(datesParam).split(',').map(d => d.trim()).filter(Boolean).slice(0, 5);
      const allAvailability = {};

      for (const date of dates) {
        try {
          const timeMin = new Date(`${date}T09:00:00-04:00`);
          const timeMax = new Date(`${date}T18:00:00-04:00`);

          const response = await calendar.freebusy.query({
            resource: {
              timeMin: timeMin.toISOString(),
              timeMax: timeMax.toISOString(),
              timeZone: 'America/Santiago',
              items: [{ id: 'primary' }],
            },
          });

          const busySlots = response.data.calendars?.primary?.busy || [];
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
      return res.json({ results: [{ result: allAvailability }] });
    }

    // Schedule
    if (action === 'schedule') {
      const params = extractParams(req);
      console.log('Schedule params:', JSON.stringify(params));
      const { date, time, caller_name, caller_email, caller_phone } = params;
      if (!date || !time) {
        return res.json({ results: [{ error: 'date and time required' }] });
      }

      const startTime = new Date(`${date}T${time}:00-04:00`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const event = {
        summary: `Cita: ${caller_name || 'Cliente'}`,
        description: `Agendado por Sol-IA\nNombre: ${caller_name || 'N/A'}\nEmail: ${caller_email || 'N/A'}\nTeléfono: ${caller_phone || 'N/A'}`,
        start: { dateTime: startTime.toISOString(), timeZone: 'America/Santiago' },
        end: { dateTime: endTime.toISOString(), timeZone: 'America/Santiago' },
        attendees: caller_email ? [{ email: caller_email }] : [],
      };

      const result = await calendar.events.insert({ calendarId: 'primary', resource: event, sendUpdates: 'all' });
      return res.json({ results: [{ result: { success: true, message: `Cita agendada para ${caller_name || 'cliente'} el ${date} a las ${time}`, event_link: result.data.htmlLink } }] });
    }

    return res.json({ results: [{ error: 'Invalid action' }] });
  } catch (error) {
    console.error('Calendar error:', error.message, error.stack);
    return res.json({ results: [{ error: `Calendar error: ${error.message}` }] });
  }
}
