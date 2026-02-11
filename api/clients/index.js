import { getAllClients } from '../lib/store.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const authHeader = req.headers['x-admin-key'];
    if (authHeader !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clients = getAllClients();
    const list = Object.values(clients).map((c) => ({
      id: c.id,
      name: c.name,
      business: c.business,
      email: c.email,
      calendarConnected: c.calendarConnected,
      connectedEmail: c.connectedEmail,
      connectedAt: c.connectedAt,
      createdAt: c.createdAt,
      agentId: c.agentId || null,
    }));

    res.json(list);
  } catch (err) {
    console.error('Error in /api/clients:', err);
    res.status(500).json({ error: err.message });
  }
}
