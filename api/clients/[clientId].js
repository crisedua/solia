import { getClient } from '../lib/store.js';

export default function handler(req, res) {
  try {
    const { clientId } = req.query;
    const client = getClient(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      id: client.id,
      name: client.name,
      business: client.business,
      calendarConnected: client.calendarConnected,
      connectedEmail: client.connectedEmail,
    });
  } catch (err) {
    console.error('Error in /api/clients/[clientId]:', err);
    res.status(500).json({ error: err.message });
  }
}
