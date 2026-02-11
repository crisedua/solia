import { VapiClient } from '@vapi-ai/server-sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const authHeader = req.headers['x-admin-key'];
    if (authHeader !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const vapi = new VapiClient({ token: process.env.VAPI_API_KEY });
    const assistants = await vapi.assistants.list();

    const list = (assistants || []).map((a) => ({
      id: a.id,
      name: a.name || 'Sin nombre',
      createdAt: a.createdAt,
      model: a.model?.model || 'unknown',
    }));

    res.json(list);
  } catch (err) {
    console.error('Error listing agents:', err);
    res.status(500).json({ error: err.message });
  }
}
