import { VapiClient } from '@vapi-ai/server-sdk';

function getClient() {
  return new VapiClient({ token: process.env.VAPI_API_KEY });
}

/**
 * Creates a VAPI assistant for a specific client.
 * The assistant's tools point back to our API with the clientId,
 * so each client's agent uses their own Google Calendar.
 */
export async function createAgentForClient(clientId, client, baseApiUrl) {
  const vapi = getClient();

  try {
    const assistant = await vapi.assistants.create({
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
              url: `${baseApiUrl}/api/calendar/${clientId}?action=availability`,
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
              url: `${baseApiUrl}/api/calendar/${clientId}?action=schedule`,
            },
          },
        ],
      },
      voice: {
        provider: '11labs',
        voiceId: 'paula',
      },
    });

    console.log(`VAPI assistant created: ${assistant.id} for ${client.business}`);
    return assistant.id;
  } catch (err) {
    console.error('Failed to create VAPI assistant:', err.message || err);
    return null;
  }
}

export { getClient };
