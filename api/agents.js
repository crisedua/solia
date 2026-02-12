import { VapiClient } from '@vapi-ai/server-sdk';
import { upsertClient, getClient } from './lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const action = req.query.action;

  try {
    const vapi = new VapiClient({ token: process.env.VAPI_API_KEY });

    // GET /api/agents?action=list
    if (req.method === 'GET' && action === 'list') {
      const assistants = await vapi.assistants.list();
      const list = (assistants || []).map((a) => ({
        id: a.id, name: a.name || 'Sin nombre',
        createdAt: a.createdAt, model: a.model?.model || 'unknown',
      }));
      return res.json(list);
    }

    // POST /api/agents?action=assign
    if (req.method === 'POST' && action === 'assign') {
      const { clientId, agentId } = req.body || {};
      if (!clientId || !agentId) return res.status(400).json({ error: 'clientId and agentId required' });

      const client = await getClient(clientId);
      if (!client) return res.status(404).json({ error: 'Client not found' });

      let agent;
      try { agent = await vapi.assistants.get(agentId); }
      catch { return res.status(404).json({ error: 'VAPI agent not found' }); }

      // Update agent tools to point to this client's calendar
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
                  description: 'Verifica disponibilidad en el calendario para una fecha.',
                  parameters: {
                    type: 'object',
                    properties: { date: { type: 'string', description: 'Fecha YYYY-MM-DD' } },
                    required: ['date'],
                  },
                },
                server: { url: `${baseApiUrl}/api/calendar/${clientId}?action=availability` },
              },
              {
                type: 'function',
                function: {
                  name: 'scheduleMeeting',
                  description: 'Agenda una cita en el calendario.',
                  parameters: {
                    type: 'object',
                    properties: {
                      date: { type: 'string', description: 'Fecha YYYY-MM-DD' },
                      time: { type: 'string', description: 'Hora HH:MM 24h' },
                      caller_name: { type: 'string', description: 'Nombre del llamante' },
                      caller_email: { type: 'string', description: 'Correo del llamante' },
                      caller_phone: { type: 'string', description: 'Teléfono del llamante' },
                    },
                    required: ['date', 'time'],
                  },
                },
                server: { url: `${baseApiUrl}/api/calendar/${clientId}?action=schedule` },
              },
            ],
          },
        });
      } catch (err) {
        console.error('Failed to update agent tools:', err);
      }

      const updated = await upsertClient(clientId, { agentId, agentName: agent.name || 'Sin nombre' });
      return res.json({ success: true, client: updated });
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=list|assign' });
  } catch (err) {
    console.error('Agents error:', err);
    return res.status(500).json({ error: err.message });
  }
}
