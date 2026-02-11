import { google } from 'googleapis';
import { getClient } from '../../lib/store.js';
import { createOAuth2Client } from '../../lib/google.js';

export default async function handler(req, res) {
  try {
    const { clientId } = req.query;
    const date = req.query.date || req.body?.date;

    if (!date) return res.status(400).json({ error: 'date parameter required (YYYY-MM-DD)' });

    const client = await getClient(clientId);
    if (!client || !client.tokens) return res.status(404).json({ error: 'Client not found or not connected' });

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(client.tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
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

    const busySlots = response.data.calendars.primary.busy;
    const availableSlots = [];
    let current = new Date(timeMin);

    while (current < timeMax) {
      const next = new Date(current.getTime() + 60 * 60 * 1000);
      const isBusy = busySlots.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return current < busyEnd && next > busyStart;
      });
      if (!isBusy) availableSlots.push(current.toTimeString().slice(0, 5));
      current = next;
    }

    res.json({ date, available_slots: availableSlots });
  } catch (error) {
    console.error('Calendar error:', error.message);
    res.status(500).json({ error: 'Failed to check availability' });
  }
}
