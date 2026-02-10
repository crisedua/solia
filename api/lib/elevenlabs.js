import https from 'https';

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.elevenlabs.io',
      path,
      method,
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
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

export async function createAgentForClient(clientId, client, baseApiUrl) {
  const agentConfig = {
    name: `${client.business} - Voice Agent`,
    conversation_config: {
      agent: {
        prompt: {
          prompt: `You are a friendly and professional AI receptionist for ${client.business}. Your name is Solia.

Your job is to:
- Answer calls professionally
- Check calendar availability when someone wants to book an appointment
- Schedule appointments
- Collect caller information (name, email, phone)

Always be warm, helpful, and efficient. Speak in Spanish unless the caller speaks English.

Business: ${client.business}
Contact: ${client.name}`,
          tools: [
            {
              type: 'webhook',
              name: 'checkAvailability',
              description: 'Check calendar availability for a date. Returns available time slots.',
              api: {
                url: `${baseApiUrl}/api/calendar/${clientId}/availability`,
                method: 'GET',
                query_params: {
                  date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
                },
              },
            },
            {
              type: 'webhook',
              name: 'scheduleMeeting',
              description: 'Book an appointment on the calendar.',
              api: {
                url: `${baseApiUrl}/api/calendar/${clientId}/schedule`,
                method: 'POST',
                body_params: {
                  date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
                  time: { type: 'string', description: 'Time in HH:MM 24h format' },
                  caller_name: { type: 'string', description: 'Caller name' },
                  caller_email: { type: 'string', description: 'Caller email' },
                  caller_phone: { type: 'string', description: 'Caller phone number' },
                },
              },
            },
          ],
        },
        first_message: `Hola, gracias por llamar a ${client.business}. Soy Solia, su asistente virtual. ¿En qué puedo ayudarle?`,
        language: 'es',
      },
    },
  };

  const res = await apiCall('POST', '/v1/convai/agents/create', agentConfig);

  if (res.status === 200 && res.data.agent_id) {
    return res.data.agent_id;
  }

  console.error('Failed to create ElevenLabs agent:', res.status, res.data);
  return null;
}

export { apiCall };
