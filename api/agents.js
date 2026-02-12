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
      const systemPrompt = `Eres Solia, asistente virtual de Vista Costa - asesoría inmobiliaria en Concón, Quintero y Viña del Mar.

ESPECIALIDAD: Propiedades frente al mar, residencias exclusivas, terrenos con vista.

TU TRABAJO:
1. Pregunta qué propiedad buscan (casa/depto/parcela)
2. Pregunta: ¿compra o arriendo? ¿qué comuna? ¿cuántos dormitorios?
3. Obtén contacto: "Para que un asesor te contacte, ¿tu nombre completo?"
4. "¿Tu correo?"
5. "¿Tu teléfono?"
6. Llama saveCaller con los datos
7. "Perfecto, un asesor te contactará pronto"

REGLAS:
- Habla SOLO en español chileno
- Una pregunta a la vez
- DEBES llamar saveCaller después de obtener los 3 datos
- Sé breve y natural

CONTACTO: +569 9541 5317 | info@vistacosta.cl | www.vistacosta.cl`;

      try {
        await vapiPatch(agentId, {
          silenceTimeoutSeconds: 30,
          responseDelaySeconds: 0.4,
          maxDurationSeconds: 600,
          endCallMessage: "Gracias por llamar a Vista Costa. ¡Hasta pronto!",
          firstMessage: "Hola, gracias por llamar a Vista Costa. Soy Solia, tu asistente virtual. Somos una asesoría inmobiliaria especializada en propiedades frente al mar y residencias exclusivas en Concón, Quintero y Viña del Mar. ¿Qué tipo de propiedad estás buscando?",
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            temperature: 0.7,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'system', content: 'CRITICAL: After collecting name, email, and phone, call saveCaller tool immediately. Speak only Spanish.' }
            ],
            tools: [
              {
                type: 'function',
                function: {
                  name: 'saveCaller',
                  description: 'Guarda la información del cliente en la hoja de contactos. Usar al final de cada llamada para registrar leads.',
                  parameters: {
                    type: 'object',
                    properties: {
                      caller_name: { type: 'string', description: 'Nombre del cliente' },
                      caller_email: { type: 'string', description: 'Correo del cliente' },
                      caller_phone: { type: 'string', description: 'Teléfono del cliente' },
                      notes: { type: 'string', description: 'Resumen: tipo de propiedad buscada, operación (compra/arriendo), ubicación preferida, presupuesto, etc.' },
                    },
                    required: ['caller_name'],
                  },
                },
                server: { url: `${baseApiUrl}/api/calendar/${clientId}?action=saveCaller`, timeoutSeconds: 30 },
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
