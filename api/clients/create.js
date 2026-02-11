import crypto from 'crypto';
import { upsertClient } from '../lib/store.js';

export default function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers['x-admin-key'];
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return res.status(500).json({ error: 'ADMIN_SECRET not configured on server' });
    }

    if (authHeader !== adminSecret) {
      return res.status(401).json({ error: 'Unauthorized', received: !!authHeader });
    }

    const { name, business, email, phone } = req.body || {};
    if (!name || !business) {
      return res.status(400).json({ error: 'name and business are required' });
    }

    const clientId = crypto.randomBytes(12).toString('base64url');
    const baseUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';

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

    res.json({
      client,
      onboardingUrl: `${baseUrl}/onboard/${clientId}`,
    });
  } catch (err) {
    console.error('Error in /api/clients/create:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
