import { scheduleMeeting } from './lib/calendar-service.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const clientId = process.env.DEMO_CLIENT_ID;
    if (!clientId) {
        return res.status(500).json({ error: 'DEMO_CLIENT_ID not configured' });
    }

    try {
        const { date, time, email, name, caller_email, caller_name, caller_phone } = req.body;

        // Normalize params (agent might send different names)
        const params = {
            date,
            time,
            caller_email: email || caller_email,
            caller_name: name || caller_name,
            caller_phone
        };

        if (!params.date || !params.time || !params.caller_email) {
            return res.status(400).json({ error: 'Missing required fields: date, time, email' });
        }

        const result = await scheduleMeeting(clientId, params);
        res.json(result);
    } catch (error) {
        console.error('ScheduleMeeting Error:', error);
        res.status(500).json({ error: error.message });
    }
}
