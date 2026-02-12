import { VapiClient } from '@vapi-ai/server-sdk';
import { upsertClient, getClient } from './lib/store.js';

async function vapiPatch(agentId, body) {
  const res = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

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
      const { clientId, agentId, agentName } = req.body || {};
      if (!clientId || !agentId) return res.status(400).json({ error: 'clientId and agentId required' });

      const client = await getClient(clientId);
      if (!client) return res.status(404).json({ error: 'Client not found' });

      const baseApiUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';
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

      try {
        await vapiPatch(agentId, {
          model: {
            provider: 'openai',
            model: 'gpt-4o',
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
        console.error('VAPI update error:', err.message);
        return res.status(500).json({ error: 'Failed to update VAPI agent', detail: err.message });
      }

      const updated = await upsertClient(clientId, { agentId, agentName: agentName || 'Sin nombre' });
      return res.json({ success: true, client: updated });
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=list|assign' });
  } catch (err) {
    console.error('Agents error:', err);
    return res.status(500).json({ error: err.message });
  }
}
