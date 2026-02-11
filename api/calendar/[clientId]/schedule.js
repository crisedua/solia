import { google } from 'googleapis';
import { getClient } from '../../lib/store.js';
import { createOAuth2Client } from '../../lib/google.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { clientId } = req.query;
    const { date, time, caller_name, caller_email, caller_phone } = req.body;

    if (!date || !time) return res.status(400).json({ error: 'date and time are required' });

    const client = await getClient(clientId);
    if (!client || !client.tokens) return res.status(404).json({ error: 'Client not found or not connected' });

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(client.tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
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

    res.json({ success: true, message: `Booked for ${caller_name || 'client'} on ${date} at ${time}`, event_link: result.data.htmlLink });
  } catch (error) {
    console.error('Schedule error:', error.message);
    res.status(500).json({ error: 'Failed to schedule appointment' });
  }
}
