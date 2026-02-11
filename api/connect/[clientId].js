import { getClient } from '../lib/store.js';
import { createOAuth2Client, SCOPES } from '../lib/google.js';

export default async function handler(req, res) {
  try {
    const { clientId } = req.query;
    const client = await getClient(clientId);

    if (!client) {
      return res.status(404).send('Invalid link');
    }

    const oauth2Client = createOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: JSON.stringify({ clientId }),
      prompt: 'consent',
    });

    res.redirect(authUrl);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error starting authentication');
  }
}
