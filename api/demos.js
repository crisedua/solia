import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const action = req.query.action;

    try {
        // GET /api/demos?action=get&id=xxx (public — used by demo page)
        if (req.method === 'GET' && action === 'get') {
            const id = req.query.id;
            if (!id) return res.status(400).json({ error: 'id required' });

            const { data, error } = await supabase
                .from('demos')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return res.status(404).json({ error: 'Demo not found' });

            return res.json({
                id: data.id,
                name: data.name,
                agentId: data.agent_id,
                websiteUrl: data.website_url || null,
            });
        }

        // GET /api/demos?action=list (admin)
        if (req.method === 'GET' && action === 'list') {
            if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { data, error } = await supabase
                .from('demos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return res.json(
                (data || []).map((d) => ({
                    id: d.id,
                    name: d.name,
                    agentId: d.agent_id,
                    websiteUrl: d.website_url || null,
                    createdAt: d.created_at,
                }))
            );
        }

        // POST /api/demos?action=create (admin)
        if (req.method === 'POST' && action === 'create') {
            if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { name, agentId, websiteUrl } = req.body || {};
            if (!name || !agentId) {
                return res.status(400).json({ error: 'name and agentId required' });
            }

            const id = crypto.randomBytes(8).toString('base64url');

            const { data, error } = await supabase
                .from('demos')
                .insert({ id, name, agent_id: agentId, website_url: websiteUrl || null, created_at: Date.now() })
                .select()
                .single();

            if (error) throw error;

            const baseUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';
            return res.json({
                id: data.id,
                name: data.name,
                agentId: data.agent_id,
                websiteUrl: data.website_url || null,
                demoUrl: `${baseUrl}/demo/${data.id}`,
            });
        }

        // POST /api/demos?action=delete (admin)
        if (req.method === 'POST' && action === 'delete') {
            if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { id } = req.body || {};
            if (!id) return res.status(400).json({ error: 'id required' });

            const { error } = await supabase.from('demos').delete().eq('id', id);
            if (error) throw error;

            return res.json({ success: true });
        }

        return res.status(400).json({ error: 'Invalid action. Use ?action=list|get|create|delete' });
    } catch (err) {
        console.error('Demos error:', err);
        return res.status(500).json({ error: err.message });
    }
}
