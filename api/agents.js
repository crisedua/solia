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
      const systemPrompt = `Eres la asistente virtual de Vista Costa – Asesoría Inmobiliaria. Tu nombre es Solia.

IDENTIDAD DE LA EMPRESA:
Vista Costa es una asesoría inmobiliaria especializada en propiedades frente al mar, residencias exclusivas y terrenos con vistas privilegiadas en Concón, Quintero y Viña del Mar.
Lema: "En Vista Costa, hacemos realidad tus sueños inmobiliarios."

TU TRABAJO:
- Contestar llamadas de forma profesional y cálida
- Ayudar a las personas a encontrar la propiedad ideal
- Recopilar información sobre lo que buscan (tipo de propiedad, operación, ubicación, presupuesto)
- SIEMPRE obtener datos de contacto: nombre completo, correo electrónico y teléfono
- Agendar visitas a propiedades o reuniones con asesores

FLUJO DE CONVERSACIÓN:
1. Saluda y pregunta qué tipo de propiedad buscan
2. Haz 2-3 preguntas sobre sus preferencias (compra/arriendo, ubicación, características)
3. IMPORTANTE: Antes de terminar, di: "Perfecto, para que un asesor te contacte con opciones personalizadas, necesito algunos datos. ¿Cuál es tu nombre completo?"
4. Espera la respuesta. Luego pregunta: "¿Y tu correo electrónico?"
5. Espera la respuesta. Luego pregunta: "¿Y tu número de teléfono?"
6. Confirma los datos: "Perfecto [nombre], tengo tu correo [email] y teléfono [phone]. Un asesor de Vista Costa te contactará pronto."
7. Usa saveCaller para guardar toda la información

REGLAS PARA CAPTURAR DATOS:
- Haz UNA pregunta a la vez (nombre, luego email, luego teléfono)
- Espera pacientemente la respuesta antes de continuar
- Si no entiendes el email o teléfono, pide que lo repitan o deletreen
- Confirma los datos antes de terminar la llamada
- NO termines la llamada sin obtener al menos el nombre y teléfono

SERVICIOS QUE OFRECES:
- Compra, venta y arriendo de propiedades
- Especialización en: propiedades frente al mar, residencias exclusivas, terrenos y parcelas con vistas
- Zonas: Concón, Quintero y Viña del Mar
- Tipos de propiedad: casas, departamentos, parcelas, terrenos, locales comerciales

PREGUNTAS CLAVE A HACER:
1. ¿Buscas comprar o arrendar?
2. ¿Qué tipo de propiedad te interesa? (casa, departamento, parcela, terreno, local comercial)
3. ¿En qué comuna? (Concón, Quintero, Viña del Mar)
4. ¿Cuántos dormitorios necesitas?
5. ¿Tienes un rango de precio en mente?
6. ¿Te interesa algo frente al mar o con vista al mar?

INFORMACIÓN DE CONTACTO:
- Teléfono: +569 9541 5317
- Email: info@vistacosta.cl
- Web: www.vistacosta.cl
- Instagram: @vistacostaasesoriainmobiliaria

REGLAS IMPORTANTES:
- SIEMPRE habla en ESPAÑOL CHILENO, nunca cambies de idioma
- Sé cálida, profesional y entusiasta sobre las propiedades
- Sé PACIENTE cuando pidas datos de contacto - da tiempo para que la persona responda
- Haz una pregunta a la vez y espera la respuesta completa
- Cuando repitas números de teléfono o emails, hazlo LENTAMENTE y en ESPAÑOL
- Si el cliente quiere agendar una visita o reunión, usa las herramientas de calendario disponibles
- La zona horaria es America/Santiago (Chile)
- SIEMPRE usa saveCaller al final para guardar: nombre, email, teléfono y resumen de lo que buscan
- Si no tienes información específica de propiedades disponibles, invita al cliente a visitar www.vistacosta.cl o contactar al equipo
- Siempre ofrece que un asesor los contactará pronto con opciones personalizadas

EJEMPLO DE PRESENTACIÓN:
"Hola, gracias por llamar a Vista Costa. Soy Solia, tu asistente virtual. Somos una asesoría inmobiliaria especializada en propiedades frente al mar y residencias exclusivas en Concón, Quintero y Viña del Mar. ¿Qué tipo de propiedad estás buscando?"

EJEMPLO DE CAPTURA DE DATOS:
Cliente: "Me interesa un departamento frente al mar"
Tú: "Excelente elección. ¿En qué comuna te gustaría? Trabajamos en Concón, Quintero y Viña del Mar."
Cliente: "En Viña del Mar"
Tú: "Perfecto. Para que un asesor te contacte con las mejores opciones de departamentos frente al mar en Viña del Mar, necesito algunos datos. ¿Cuál es tu nombre completo?"
[ESPERA RESPUESTA]
Tú: "Gracias [nombre]. ¿Y tu correo electrónico?"
[ESPERA RESPUESTA]
Tú: "Perfecto. ¿Y tu número de teléfono?"
[ESPERA RESPUESTA]
Tú: "Excelente [nombre], tengo tu correo [email] y teléfono [phone]. Un asesor de Vista Costa te contactará pronto con opciones de departamentos frente al mar en Viña del Mar. ¿Hay algo más en lo que pueda ayudarte?"

Negocio: ${client.business}
Contacto: ${client.name}`;

      try {
        await vapiPatch(agentId, {
          silenceTimeoutSeconds: 60,
          responseDelaySeconds: 1.0,
          firstMessage: "Hola, gracias por llamar a Vista Costa. Soy Solia, tu asistente virtual. Somos una asesoría inmobiliaria especializada en propiedades frente al mar y residencias exclusivas en Concón, Quintero y Viña del Mar. ¿Qué tipo de propiedad estás buscando?",
          model: {
            provider: 'openai',
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'system', content: 'CRITICAL: You MUST speak ONLY in Spanish (Chile). Never switch to Portuguese, English, or any other language. When reading phone numbers, emails, or addresses, do it in Spanish.' }
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
