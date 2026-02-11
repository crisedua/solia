import { upsertClient, getClient } from './lib/store.js';
import { VapiClient } from '@vapi-ai/server-sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers['x-admin-key'];
    if (authHeader !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { clientId, agentId } = req.body || {};
    if (!clientId || !agentId) {
      return res.status(400).json({ error: 'clientId and agentId are required' });
    }

    const client = await getClient(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Verify agent exists in VAPI
    const vapi = new VapiClient({ token: process.env.VAPI_API_KEY });
    let agent;
    try {
      agent = await vapi.assistants.get(agentId);
    } catch {
      return res.status(404).json({ error: 'VAPI agent not found' });
    }

    // Update the agent's tools to point to this client's calendar endpoints
    const baseApiUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';
    try {
      await vapi.assistants.update(agentId, {
        model: {
          ...agent.model,
          tools: [
            {
              type: 'function',
              function: {
                name: 'checkAvailability',
                description: 'Verifica la disponibilidad en el calendario para una fecha.',
                parameters: {
                  type: 'object',
                  properties: {
                    date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD' },
                  },
                  required: ['date'],
                },
              },
              server: { url: `${baseApiUrl}/api/calendar/${clientId}/availability` },
            },
            {
              type: 'function',
              function: {
                name: 'scheduleMeeting',
                description: 'Agenda una cita en el calendario.',
                parameters: {
                  type: 'object',
                  properties: {
                    date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD' },
                    time: { type: 'string', description: 'Hora en formato HH:MM 24h' },
                    caller_name: { type: 'string', description: 'Nombre del llamante' },
                    caller_email: { type: 'string', description: 'Correo del llamante' },
                    caller_phone: { type: 'string', description: 'Teléfono del llamante' },
                  },
                  required: ['date', 'time'],
                },
              },
              server: { url: `${baseApiUrl}/api/calendar/${clientId}/schedule` },
            },
          ],
        },
      });
    } catch (err) {
      console.error('Failed to update agent tools:', err);
    }

    // Save assignment
    const updated = await upsertClient(clientId, {
      agentId,
      agentName: agent.name || 'Sin nombre',
    });

    res.json({ success: true, client: updated });
  } catch (err) {
    console.error('Error assigning agent:', err);
    res.status(500).json({ error: err.message });
  }
}
