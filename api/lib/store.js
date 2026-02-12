import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function getClient(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error || !data) return null;
  return toAppFormat(data);
}

export async function upsertClient(clientId, updates) {
  const existing = await getClient(clientId);
  const merged = { ...existing, ...updates };

  const row = toDbFormat(merged);
  row.id = clientId;

  const { data, error } = await supabase
    .from('clients')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Supabase upsert error:', error);
    throw error;
  }
  return toAppFormat(data);
}

export async function getAllClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase list error:', error);
    return {};
  }

  const clients = {};
  for (const row of data || []) {
    clients[row.id] = toAppFormat(row);
  }
  return clients;
}

// Convert DB snake_case to app camelCase
function toAppFormat(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    business: row.business,
    email: row.email || '',
    phone: row.phone || '',
    agentId: row.agent_id,
    agentName: row.agent_name,
    calendarConnected: row.calendar_connected || false,
    tokens: row.tokens,
    connectedEmail: row.connected_email,
    connectedAt: row.connected_at,
    createdAt: row.created_at,
    sheetId: row.sheet_id,
  };
}

// Convert app camelCase to DB snake_case
function toDbFormat(obj) {
  const row = {};
  if (obj.id !== undefined) row.id = obj.id;
  if (obj.name !== undefined) row.name = obj.name;
  if (obj.business !== undefined) row.business = obj.business;
  if (obj.email !== undefined) row.email = obj.email;
  if (obj.phone !== undefined) row.phone = obj.phone;
  if (obj.agentId !== undefined) row.agent_id = obj.agentId;
  if (obj.agentName !== undefined) row.agent_name = obj.agentName;
  if (obj.calendarConnected !== undefined) row.calendar_connected = obj.calendarConnected;
  if (obj.tokens !== undefined) row.tokens = obj.tokens;
  if (obj.connectedEmail !== undefined) row.connected_email = obj.connectedEmail;
  if (obj.connectedAt !== undefined) row.connected_at = obj.connectedAt;
  if (obj.createdAt !== undefined) row.created_at = obj.createdAt;
  if (obj.sheetId !== undefined) row.sheet_id = obj.sheetId;
  return row;
}
