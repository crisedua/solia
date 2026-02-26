import crypto from 'crypto';
import { getAllClients, getClient, upsertClient } from '../lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;

  try {
    // GET /api/clients?action=list (admin)
    if (req.method === 'GET' && action === 'list') {
      if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const clients = await getAllClients();
      const list = Object.values(clients).map((c) => ({
        id: c.id, name: c.name, business: c.business, email: c.email,
        calendarConnected: c.calendarConnected, connectedEmail: c.connectedEmail,
        connectedAt: c.connectedAt, createdAt: c.createdAt,
        agentId: c.agentId || null, agentName: c.agentName || null,
      }));
      return res.json(list);
    }

    // GET /api/clients?action=get&id=xxx (public)
    if (req.method === 'GET' && action === 'get') {
      const clientId = req.query.id;
      if (!clientId) return res.status(400).json({ error: 'id required' });
      const client = await getClient(clientId);
      if (!client) return res.status(404).json({ error: 'Client not found' });
      return res.json({
        id: client.id, name: client.name, business: client.business,
        calendarConnected: client.calendarConnected, connectedEmail: client.connectedEmail,
      });
    }

    // POST /api/clients?action=create (admin)
    if (req.method === 'POST' && action === 'create') {
      if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { name, business, email, phone, agentId } = req.body || {};
      if (!name || !business) return res.status(400).json({ error: 'name and business required' });

      const clientId = crypto.randomBytes(12).toString('base64url');
      const baseUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';

      // Find agent name if agentId provided
      let agentName = null;
      if (agentId) {
        try {
          const agentRes = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
            headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
          });
          if (agentRes.ok) {
            const agentsData = await agentRes.json();
            const agent = (agentsData.agents || []).find(a => a.agent_id === agentId);
            agentName = agent ? agent.name : agentId;
          }
        } catch (e) {
          console.error('Failed to fetch agent name:', e);
        }
      }

      const client = await upsertClient(clientId, {
        id: clientId, name, business, email: email || '', phone: phone || '',
        createdAt: Date.now(),
        agentId: agentId || null,
        agentName: agentName || null,
        calendarConnected: false, tokens: null, connectedEmail: null, connectedAt: null,
      });
      return res.json({ client, onboardingUrl: `${baseUrl}/onboard/${clientId}` });
    }

    // POST /api/clients?action=register (public)
    if (req.method === 'POST' && action === 'register') {
      const { name, business, email, phone } = req.body || {};
      if (!name || !business) return res.status(400).json({ error: 'name and business required' });

      const clientId = crypto.randomBytes(12).toString('base64url');
      const client = await upsertClient(clientId, {
        id: clientId, name, business, email: email || '', phone: phone || '',
        createdAt: Date.now(), agentId: null, agentName: null,
        calendarConnected: false, tokens: null, connectedEmail: null, connectedAt: null,
      });
      return res.json({ client });
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=list|get|create|register' });
  } catch (err) {
    console.error('Clients error:', err);
    return res.status(500).json({ error: err.message });
  }
}
