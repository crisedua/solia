const crypto = require('crypto');
const { upsertClient } = require('../lib/store');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple admin auth via secret key
  const authHeader = req.headers['x-admin-key'];
  if (authHeader !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, business, email, phone } = req.body;
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
    gmailConnected: false,
    tokens: null,
    connectedEmail: null,
    connectedAt: null,
  });

  res.json({
    client,
    onboardingUrl: `${baseUrl}/onboard/${clientId}`,
  });
};
