import { google } from 'googleapis';
import { getClient } from '../lib/store.js';
import { createOAuth2Client } from '../lib/google.js';

/**
 * Extract parameters from VAPI tool call or direct request.
 * VAPI sends: { message: { type: "function-call", functionCall: { name, parameters } } }
 * Direct sends: { date, time, ... }
 */
function extractParams(req) {
  const body = req.body || {};
  // VAPI server tool format
  if (body.message?.functionCall?.parameters) {
    return body.message.functionCall.parameters;
  }
  // Direct API call
  return body;
}

export default async function handler(req, res) {
  // CORS for VAPI
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { clientId } = req.query;
  const action = req.query.action;

  try {
    const client = await getClient(clientId);
    if (!client || !client.tokens) {
      return res.status(404).json({ error: 'Client not found or not connected' });
    }

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(client.tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Availability (supports multiple dates)
    if (action === 'availability') {
      const params = extractParams(req);
      const datesParam = req.query.dates || req.query.date || params.dates || params.date;
      if (!datesParam) return res.status(400).json({ error: 'dates required (YYYY-MM-DD, comma separated)' });

      const dates = datesParam.split(',').map(d => d.trim()).slice(0, 5);
      const allAvailability = {};

      for (const date of dates) {
        const timeMin = new Date(`${date}T09:00:00`);
        const timeMax = new Date(`${date}T18:00:00`);

        const response = await calendar.freebusy.query({
          resource: {
            timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(),
            timeZone: 'America/Santiago', items: [{ id: 'primary' }],
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
      }

      return res.json({ results: [{ result: allAvailability }] });
    }

    // Schedule
    if (action === 'schedule') {
      const params = extractParams(req);
      const { date, time, caller_name, caller_email, caller_phone } = params;
      if (!date || !time) return res.status(400).json({ error: 'date and time required' });

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

      // Return in VAPI-compatible format
      return res.json({ results: [{ result: { success: true, message: `Cita agendada para ${caller_name || 'cliente'} el ${date} a las ${time}`, event_link: result.data.htmlLink } }] });
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=availability|schedule' });
  } catch (error) {
    console.error('Calendar error:', error.message);
    return res.status(500).json({ error: 'Calendar operation failed' });
  }
}
