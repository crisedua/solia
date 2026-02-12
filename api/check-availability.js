import { checkAvailability } from './lib/calendar-service.js';

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
        const { dates, date } = req.body;
        const dateList = dates || (date ? [date] : []);

        if (dateList.length === 0) {
            return res.status(400).json({ error: 'No dates provided' });
        }

        const availability = await checkAvailability(clientId, dateList);
        res.json(availability);
    } catch (error) {
        console.error('CheckAvailability Error:', error);
        res.status(500).json({ error: error.message });
    }
}
