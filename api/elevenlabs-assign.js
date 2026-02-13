import { upsertClient, getClient } from './lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, agentId } = req.body || {};
    if (!clientId || !agentId) {
      return res.status(400).json({ error: 'clientId and agentId required' });
    }

    const client = await getClient(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (!client.calendarConnected || !client.tokens) {
      return res.status(400).json({ error: 'Client must connect Google Calendar first' });
    }

    // Just assign the existing ElevenLabs agent ID
    // The agent's tools will use clientId from the URL parameter
    const updated = await upsertClient(clientId, { 
      agentId, 
      agentName: `${client.business} - Vista Costa` 
    });

    return res.json({ 
      success: true, 
      agentId,
      agentName: `${client.business} - Vista Costa`,
      client: updated,
      message: 'Agent assigned. Configure tools in ElevenLabs dashboard to point to: ' + 
               `${process.env.APP_BASE_URL || 'https://solia-theta.vercel.app'}/api/calendar/${clientId}?action=saveCaller`
    });
  } catch (err) {
    console.error('[ElevenLabs Assign] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
