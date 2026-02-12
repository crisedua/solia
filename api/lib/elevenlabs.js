/**
 * Creates an ElevenLabs Conversational AI agent for a specific client.
 * Each client gets their own agent with tools pointing to their Google Calendar/Sheets.
 */
export async function createElevenLabsAgent(clientId, client, baseApiUrl) {
  const headers = {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  };

  const agentConfig = {
    name: `${client.business} - Vista Costa`,
    conversation_config: {
      agent: {
        prompt: {
          prompt: `Eres el asistente virtual de Vista Costa, asesoria inmobiliaria en Concon, Quintero y Vina del Mar. Especialidad: propiedades frente al mar, residencias exclusivas, terrenos con vista.

FLUJO:
1. Pregunta tipo de propiedad (casa, departamento, parcela, local comercial)
2. Compra o arriendo?
3. En que comuna?
4. Cuantos dormitorios?
5. Presupuesto aproximado?
6. Pide nombre, email y telefono para que un asesor contacte
7. Llama la herramienta saveCaller con los datos
8. Confirma: un asesor de Vista Costa te contactara pronto

REGLAS:
- Solo espanol chileno
- Una pregunta a la vez, frases cortas
- Maximo 2-3 frases por respuesta
- No inventes propiedades ni precios exactos
- IMPORTANTE: Despues de obtener nombre, email y telefono, DEBES llamar saveCaller
- Contacto: +56 9 9541 5317, info@vistacosta.cl, www.vistacosta.cl`,
          llm: 'gemini-2.5-flash',
          temperature: 0.0,
          max_tokens: -1,
          tools: [
            {
              type: 'webhook',
              name: 'saveCaller',
              description: 'Guarda la informacion del cliente en Google Sheets. Llamar despues de obtener nombre, email y telefono.',
              url: `${baseApiUrl}/api/calendar/${clientId}?action=saveCaller`,
              method: 'POST',
              response_timeout_secs: 20,
              parameters: {
                type: 'object',
                required: ['caller_name'],
                properties: {
                  caller_name: { type: 'string', description: 'Nombre completo del cliente' },
                  caller_email: { type: 'string', description: 'Email del cliente' },
                  caller_phone: { type: 'string', description: 'Telefono del cliente' },
                  notes: { type: 'string', description: 'Notas sobre la conversacion: tipo de propiedad, operacion, comuna, presupuesto' },
                },
              },
            },
          ],
        },
        first_message: 'Hola, bienvenido a Vista Costa. Como te puedo ayudar hoy?',
      },
      tts: {
        optimize_streaming_latency: 4,
        stability: 0.5,
        similarity_boost: 0.75,
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam voice
      },
      turn: {
        turn_timeout: 10.0,
        silence_end_call_timeout: 30.0,
        turn_eagerness: 'patient',
        mode: 'turn',
      },
    },
  };

  try {
    // Create agent with tools included
    const createResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'POST',
      headers,
      body: JSON.stringify(agentConfig),
    });

    const responseText = await createResponse.text();
    
    if (!createResponse.ok) {
      console.error('[ElevenLabs] API Error:', responseText);
      throw new Error(`Failed to create agent (${createResponse.status}): ${responseText}`);
    }

    const agent = JSON.parse(responseText);
    const agentId = agent.agent_id;

    console.log(`[ElevenLabs] Created agent ${agentId} for ${client.business}`);

    return agentId;
  } catch (err) {
    console.error('[ElevenLabs] Error creating agent:', err.message);
    throw err; // Re-throw so the caller can see the actual error
  }
}
