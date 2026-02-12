import { upsertClient, getClient } from './lib/store.js';
import { createElevenLabsAgent } from './lib/elevenlabs.js';

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
    const { clientId } = req.body || {};
    if (!clientId) {
      return res.status(400).json({ error: 'clientId required' });
    }

    const client = await getClient(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (!client.calendarConnected || !client.tokens) {
      return res.status(400).json({ error: 'Client must connect Google Calendar first' });
    }

    const baseApiUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';
    
    console.log(`[ElevenLabs Assign] Creating agent for client ${clientId} (${client.business})`);
    
    const agentId = await createElevenLabsAgent(clientId, client, baseApiUrl);
    
    if (!agentId) {
      return res.status(500).json({ error: 'Failed to create ElevenLabs agent' });
    }

    const updated = await upsertClient(clientId, { 
      agentId, 
      agentName: `${client.business} - Vista Costa` 
    });

    return res.json({ 
      success: true, 
      agentId,
      agentName: `${client.business} - Vista Costa`,
      client: updated 
    });
  } catch (err) {
    console.error('[ElevenLabs Assign] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
