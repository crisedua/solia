export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const action = req.query.action;

  try {
    const headers = { 'xi-api-key': process.env.ELEVENLABS_API_KEY };

    // GET /api/elevenlabs-agents?action=list
    if (req.method === 'GET' && action === 'list') {
      const response = await fetch('https://api.elevenlabs.io/v1/convai/agents', { headers });
      const data = await response.json();
      
      const list = (data.agents || []).map((a) => ({
        id: a.agent_id,
        name: a.name || 'Sin nombre',
        createdAt: new Date(a.created_at_unix_secs * 1000).toISOString(),
        platform: 'elevenlabs',
      }));
      
      return res.json(list);
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=list' });
  } catch (err) {
    console.error('ElevenLabs agents error:', err);
    return res.status(500).json({ error: err.message });
  }
}
