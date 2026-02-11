import https from 'https';

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.vapi.ai',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * Creates a VAPI assistant for a specific client.
 * The assistant's tools (server URLs) point back to our API with the clientId,
 * so when the assistant calls checkAvailability, it hits:
 *   /api/calendar/{clientId}/availability
 */
export async function createAgentForClient(clientId, client, baseApiUrl) {
  const assistantConfig = {
    name: `${client.business} - Asistente de Voz`,
    firstMessage: `Hola, gracias por llamar a ${client.business}. Soy Solia, su asistente virtual. ¿En qué puedo ayudarle?`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres una recepcionista IA amable y profesional para ${client.business}. Tu nombre es Solia.

Tu trabajo es:
- Contestar llamadas profesionalmente
- Verificar disponibilidad en el calendario cuando alguien quiera agendar una cita
- Agendar citas
- Recopilar información del llamante (nombre, correo, teléfono)

Siempre sé cálida, servicial y eficiente. Habla en español a menos que el llamante hable inglés.

Negocio: ${client.business}
Contacto: ${client.name}`,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'checkAvailability',
            description: 'Verifica la disponibilidad en el calendario para una fecha. Devuelve los horarios disponibles.',
            parameters: {
              type: 'object',
              properties: {
                date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD' },
              },
              required: ['date'],
            },
          },
          server: {
            url: `${baseApiUrl}/api/calendar/${clientId}/availability`,
          },
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
          server: {
            url: `${baseApiUrl}/api/calendar/${clientId}/schedule`,
          },
        },
      ],
    },
    voice: {
      provider: '11labs',
      voiceId: 'paula',
    },
    language: 'es',
  };

  const res = await apiCall('POST', '/assistant', assistantConfig);

  if ((res.status === 200 || res.status === 201) && res.data.id) {
    return res.data.id;
  }

  console.error('Failed to create VAPI assistant:', res.status, JSON.stringify(res.data));
  return null;
}

export { apiCall };
