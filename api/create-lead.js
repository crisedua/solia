import { saveCaller } from './lib/calendar-service.js';

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
        const { name, email, phone, need, notes } = req.body;

        const params = {
            caller_name: name,
            caller_email: email,
            caller_phone: phone,
            notes: `${need ? 'Need: ' + need + '. ' : ''}${notes || ''}`
        };

        const result = await saveCaller(clientId, params);
        res.json(result);
    } catch (error) {
        console.error('CreateLead Error:', error);
        res.status(500).json({ error: error.message });
    }
}
