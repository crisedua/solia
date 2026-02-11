import crypto from 'crypto';
import { upsertClient } from './lib/store.js';

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, business, email, phone } = req.body || {};
    if (!name || !business) {
      return res.status(400).json({ error: 'name and business are required' });
    }

    const clientId = crypto.randomBytes(12).toString('base64url');

    const client = upsertClient(clientId, {
      id: clientId,
      name,
      business,
      email: email || '',
      phone: phone || '',
      createdAt: Date.now(),
      agentId: null,
      calendarConnected: false,
      tokens: null,
      connectedEmail: null,
      connectedAt: null,
    });

    res.json({ client });
  } catch (err) {
    console.error('Error in /api/register-client:', err);
    res.status(500).json({ error: err.message });
  }
}
