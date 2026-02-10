const { getClient } = require('../lib/store');
const { createOAuth2Client, SCOPES } = require('../lib/google');

module.exports = (req, res) => {
  const { clientId } = req.query;
  const client = getClient(clientId);

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
};
