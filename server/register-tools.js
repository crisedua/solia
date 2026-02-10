import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.ELEVENLABS_API_KEY;
const agentId = 'agent_5801kh1zs5kbfpkrk059x3hqet8v';

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.elevenlabs.io',
      path,
      method,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    };
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload);
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const tools = [
  {
    type: 'client',
    name: 'checkAvailability',
    description: 'Checks Google Calendar availability for a specific date. Returns available time slots. Use when user wants to know available times.',
    expects_response: true,
    response_timeout_secs: 10,
    parameters: {
      type: 'object',
      description: 'Parameters for checking availability',
      properties: {
        date: { type: 'string', description: 'Date to check in YYYY-MM-DD format' },
      },
      required: ['date'],
    },
  },
  {
    type: 'client',
    name: 'scheduleMeeting',
    description: 'Schedules a meeting on Google Calendar. Use when user confirms they want to book a meeting or demo.',
    expects_response: true,
    response_timeout_secs: 10,
    parameters: {
      type: 'object',
      description: 'Parameters for scheduling',
      properties: {
        date: { type: 'string', description: 'Meeting date in YYYY-MM-DD format' },
        time: { type: 'string', description: 'Meeting time in HH:MM 24h format, e.g. 14:00' },
        email: { type: 'string', description: 'Client email address' },
        name: { type: 'string', description: 'Client name' },
      },
      required: ['date', 'time', 'email'],
    },
  },
  {
    type: 'client',
    name: 'createLead',
    description: 'Creates a new lead/prospect. Use when you have at least name and email from an interested prospect.',
    expects_response: true,
    response_timeout_secs: 10,
    parameters: {
      type: 'object',
      description: 'Lead parameters',
      properties: {
        name: { type: 'string', description: 'Prospect name' },
        email: { type: 'string', description: 'Prospect email' },
        phone: { type: 'string', description: 'Prospect phone' },
        need: { type: 'string', description: 'Main interest or need' },
        notes: { type: 'string', description: 'Additional notes' },
      },
      required: ['name', 'email'],
    },
  },
];

async function main() {
  const toolIds = [];

  for (const tool of tools) {
    console.log('Creating tool: ' + tool.name);
    const res = await apiCall('POST', '/v1/convai/tools', { tool_config: tool });
    console.log('  Status: ' + res.status);
    if (res.status === 200 && res.data.id) {
      console.log('  Tool ID: ' + res.data.id);
      toolIds.push(res.data.id);
    } else {
      console.log('  Error:', JSON.stringify(res.data));
    }
  }

  if (toolIds.length === 0) {
    console.log('No tools created.');
    return;
  }

  console.log('Linking ' + toolIds.length + ' tools to agent...');
  const patchRes = await apiCall('PATCH', '/v1/convai/agents/' + agentId, {
    conversation_config: {
      agent: { prompt: { tool_ids: toolIds } },
    },
  });
  console.log('Patch status: ' + patchRes.status);

  const linked = patchRes.data?.conversation_config?.agent?.prompt?.tool_ids || [];
  const configs = patchRes.data?.conversation_config?.agent?.prompt?.tools || [];
  console.log('Tool IDs on agent: ' + JSON.stringify(linked));
  console.log('Tools count: ' + configs.length);
  configs.forEach(t => console.log('  - ' + t.name + ' (' + t.type + ')'));
}

main().catch(console.error);
