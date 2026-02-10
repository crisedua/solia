const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

module.exports = async (req, res) => {
  const { code, state } = req.query;
  let stateData = {};
  try {
    stateData = JSON.parse(state || '{}');
  } catch (_) {}

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Get user email
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    let email = 'unknown';
    try {
      const userInfo = await oauth2.userinfo.get();
      email = userInfo.data.email || 'unknown';
    } catch (_) {}

    if (stateData.type === 'shared' && stateData.linkId) {
      // For shared links, we'll store in Vercel KV or similar
      // For now, redirect to success page with linkId
      const baseUrl = process.env.APP_BASE_URL || 'https://solia.vercel.app';
      return res.redirect(`${baseUrl}/connections/${stateData.linkId}/success?email=${encodeURIComponent(email)}`);
    }

    // Owner flow
    const baseUrl = process.env.APP_BASE_URL || 'https://solia.vercel.app';
    res.redirect(`${baseUrl}/oauth/success?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Error during authentication');
  }
};
