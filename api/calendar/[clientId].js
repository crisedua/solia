import { google } from 'googleapis';
import { getClient } from '../lib/store.js';
import { createOAuth2Client } from '../lib/google.js';

export default async function handler(req, res) {
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

    // Availability
    if (action === 'availability') {
      const date = req.query.date || req.body?.date;
      if (!date) return res.status(400).json({ error: 'date required (YYYY-MM-DD)' });

      const timeMin = new Date(`${date}T09:00:00`);
      const timeMax = new Date(`${date}T18:00:00`);

      const response = await calendar.freebusy.query({
        resource: {
          timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(),
          timeZone: 'America/Santiago', items: [{ id: 'primary' }],
        },
      });

      const busySlots = response.data.calendars.primary.busy;
      const availableSlots = [];
      let current = new Date(timeMin);
      while (current < timeMax) {
        const next = new Date(current.getTime() + 60 * 60 * 1000);
        const isBusy = busySlots.some((b) => current < new Date(b.end) && next > new Date(b.start));
        if (!isBusy) availableSlots.push(current.toTimeString().slice(0, 5));
        current = next;
      }
      return res.json({ date, available_slots: availableSlots });
    }

    // Schedule
    if (action === 'schedule') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
      const { date, time, caller_name, caller_email, caller_phone } = req.body || {};
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
      return res.json({ success: true, message: `Cita agendada para ${caller_name || 'cliente'} el ${date} a las ${time}`, event_link: result.data.htmlLink });
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=availability|schedule' });
  } catch (error) {
    console.error('Calendar error:', error.message);
    return res.status(500).json({ error: 'Calendar operation failed' });
  }
}
