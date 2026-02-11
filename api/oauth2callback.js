import { google } from 'googleapis';
import { createOAuth2Client } from './lib/google.js';
import { upsertClient, getClient } from './lib/store.js';
import { createAgentForClient } from './lib/elevenlabs.js';

export default async function handler(req, res) {
  const { code, state } = req.query;
  let stateData = {};
  try { stateData = JSON.parse(state || '{}'); } catch (_) {}

  const clientId = stateData.clientId;
  if (!clientId) return res.status(400).send('Missing client identifier');

  const client = await getClient(clientId);
  if (!client) return res.status(404).send('Client not found');

  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    let email = 'unknown';
    try {
      const userInfo = await oauth2.userinfo.get();
      email = userInfo.data.email || 'unknown';
    } catch (_) {}

    await upsertClient(clientId, {
      tokens,
      connectedEmail: email,
      connectedAt: Date.now(),
      calendarConnected: true,
    });

    const baseApiUrl = process.env.APP_BASE_URL || 'https://solia-theta.vercel.app';
    createAgentForClient(clientId, client, baseApiUrl).then(async (agentId) => {
      if (agentId) {
        await upsertClient(clientId, { agentId });
        console.log(`Agent ${agentId} created for client ${clientId}`);
      }
    }).catch((err) => console.error('Agent creation failed:', err));

    res.redirect(`${baseApiUrl}/onboard/${clientId}/success?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
}
