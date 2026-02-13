/**
 * Creates an ElevenLabs Conversational AI agent for a specific client.
 * Each client gets their own agent with tools pointing to their Google Calendar/Sheets.
 */
export async function createElevenLabsAgent(clientId, client, baseApiUrl) {
  const headers = {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  };

  // Simplified agent config matching ElevenLabs API structure
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
        },
        first_message: 'Hola, bienvenido a Vista Costa. Como te puedo ayudar hoy?',
      },
      tts: {
        voice_id: 'pNInz6obpgDQGcFmaJgB',
      },
    },
  };

  try {
    console.log('[ElevenLabs] Creating agent with config:', JSON.stringify(agentConfig, null, 2));
    
    const createResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'POST',
      headers,
      body: JSON.stringify(agentConfig),
    });

    const responseText = await createResponse.text();
    console.log('[ElevenLabs] API Response:', responseText);
    
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
    throw err;
  }
}
