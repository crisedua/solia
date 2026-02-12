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
      console.log('VAPI agents raw IDs:', (assistants || []).map(a => ({ id: a.id, type: typeof a.id })));
      return res.json(list);
    }

    // POST /api/agents?action=assign
    if (req.method === 'POST' && action === 'assign') {
      const { clientId, agentId } = req.body || {};
      console.log('Assign request - clientId:', clientId, 'agentId:', agentId, 'type:', typeof agentId);
      if (!clientId || !agentId) return res.status(400).json({ error: 'clientId and agentId required' });

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(agentId)) {
        return res.status(400).json({ error: `Invalid agent ID format: "${agentId}"` });
      }

      const client = await getClient(clientId);
      if (!client) return res.status(404).json({ error: 'Client not found' });

      let agent;
      try {
        agent = await vapi.assistants.get(agentId);
      } catch (err) {
        console.error('VAPI get agent error:', err?.message || err, 'agentId:', agentId);
        return res.status(404).json({ error: 'VAPI agent not found', detail: err?.message || String(err) });
      }

      // Update agent tools and system prompt to point to this client's calendar
      const baseApiUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';
      try {
        const systemPrompt = `Eres una recepcionista IA amable y profesional para ${client.business}. Tu nombre es Solia.

Tu trabajo es:
- Contestar llamadas profesionalmente
- Verificar disponibilidad en el calendario cuando alguien quiera agendar una cita
- Agendar citas usando las herramientas disponibles
- Recopilar información del llamante (nombre, correo, teléfono)

REGLAS IMPORTANTES:
- La zona horaria es America/Santiago (Chile). NO preguntes por zona horaria.
- Cuando el llamante pida una cita, pregunta la fecha deseada y usa checkAvailability para ver horarios libres.
- Presenta los horarios disponibles y deja que el llamante elija.
- Una vez confirmado, usa scheduleMeeting para agendar.
- Siempre confirma nombre, correo y teléfono antes de agendar.
- Habla en español a menos que el llamante hable inglés.

Negocio: ${client.business}
Contacto: ${client.name}`;

        await vapi.assistants.update(agentId, {
          model: {
            ...agent.model,
            messages: [{ role: 'system', content: systemPrompt }],
            tools: [
              {
                type: 'function',
                function: {
                  name: 'checkAvailability',
                  description: 'Verifica disponibilidad en el calendario para una fecha. Devuelve horarios disponibles entre 09:00 y 18:00 hora Chile.',
                  parameters: {
                    type: 'object',
                    properties: { date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD' } },
                    required: ['date'],
                  },
                },
                server: { url: `${baseApiUrl}/api/calendar/${clientId}?action=availability` },
              },
              {
                type: 'function',
                function: {
                  name: 'scheduleMeeting',
                  description: 'Agenda una cita en el calendario del negocio. Zona horaria Chile.',
                  parameters: {
                    type: 'object',
                    properties: {
                      date: { type: 'string', description: 'Fecha YYYY-MM-DD' },
                      time: { type: 'string', description: 'Hora HH:MM formato 24h' },
                      caller_name: { type: 'string', description: 'Nombre del llamante' },
                      caller_email: { type: 'string', description: 'Correo del llamante' },
                      caller_phone: { type: 'string', description: 'Teléfono del llamante' },
                    },
                    required: ['date', 'time', 'caller_name'],
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
