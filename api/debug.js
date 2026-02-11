import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const checks = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    ADMIN_SECRET: !!process.env.ADMIN_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    ELEVENLABS_API_KEY: !!process.env.ELEVENLABS_API_KEY,
    APP_BASE_URL: process.env.APP_BASE_URL || 'not set',
  };

  let dbStatus = 'not tested';
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      const { data, error } = await supabase.from('clients').select('id').limit(1);
      if (error) {
        dbStatus = `error: ${error.message}`;
      } else {
        dbStatus = `ok (${data.length} rows returned)`;
      }
    } catch (err) {
      dbStatus = `exception: ${err.message}`;
    }
  } else {
    dbStatus = 'missing env vars';
  }

  res.json({ envVars: checks, database: dbStatus });
}
