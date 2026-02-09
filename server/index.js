const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Google Calendar Setup
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'tokens.json');
const LINKS_PATH = path.join(__dirname, 'share-links.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Load saved tokens if they exist
try {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oauth2Client.setCredentials(tokens);
    console.log('Loaded saved Google Calendar tokens');
  }
} catch (error) {
  console.error('Error loading tokens:', error);
}

// --- Share Links Storage ---
const loadLinks = () => {
  try {
    if (fs.existsSync(LINKS_PATH)) {
      return JSON.parse(fs.readFileSync(LINKS_PATH, 'utf-8'));
    }
  } catch (_) {}
  return {};
};

const saveLinks = (links) => {
  fs.writeFileSync(LINKS_PATH, JSON.stringify(links, null, 2));
};

const saveTokens = (tokens) => {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Tokens saved to', TOKEN_PATH);
};

// =====================
// AUTH ROUTES
// =====================

// Owner connects themselves directly
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: JSON.stringify({ type: 'owner' }),
    prompt: 'consent',
  });
  res.redirect(authUrl);
});

// Generate a shareable connection link (72h expiry)
app.post('/api/connections/generate', (req, res) => {
  const linkId = crypto.randomBytes(16).toString('base64url');
  const expiresAt = Date.now() + 72 * 60 * 60 * 1000; // 72 hours

  const links = loadLinks();
  links[linkId] = {
    createdAt: Date.now(),
    expiresAt,
    used: false,
    connectedEmail: null,
  };
  saveLinks(links);

  const baseUrl = process.env.APP_BASE_URL || `http://localhost:5173`;
  const shareUrl = `${baseUrl}/connections/${linkId}`;

  res.json({
    linkId,
    url: shareUrl,
    expiresAt: new Date(expiresAt).toISOString(),
    expiresInHours: 72,
  });
});

// Check if a share link is valid
app.get('/api/connections/:linkId', (req, res) => {
  const links = loadLinks();
  const link = links[req.params.linkId];

  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }
  if (link.used) {
    return res.status(410).json({ error: 'Link already used', connectedEmail: link.connectedEmail });
  }
  if (Date.now() > link.expiresAt) {
    return res.status(410).json({ error: 'Link expired' });
  }

  res.json({
    valid: true,
    expiresAt: new Date(link.expiresAt).toISOString(),
  });
});

// Start OAuth for a shared link (client clicks "Connect")
app.get('/auth/connect/:linkId', (req, res) => {
  const links = loadLinks();
  const link = links[req.params.linkId];

  if (!link || link.used || Date.now() > link.expiresAt) {
    return res.status(410).send('This connection link is no longer valid.');
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: JSON.stringify({ type: 'shared', linkId: req.params.linkId }),
    prompt: 'consent',
  });
  res.redirect(authUrl);
});

// OAuth callback — handles both owner and shared-link flows
app.get('/oauth2callback', async (req, res) => {
  const { code, state } = req.query;
  let stateData = {};
  try {
    stateData = JSON.parse(state || '{}');
  } catch (_) {}

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get the user's email for reference
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    let email = 'unknown';
    try {
      const userInfo = await oauth2.userinfo.get();
      email = userInfo.data.email || 'unknown';
    } catch (_) {}

    if (stateData.type === 'shared' && stateData.linkId) {
      // Save tokens per connection
      const connectionTokenPath = path.join(__dirname, `tokens-${stateData.linkId}.json`);
      fs.writeFileSync(connectionTokenPath, JSON.stringify(tokens));

      // Mark link as used
      const links = loadLinks();
      if (links[stateData.linkId]) {
        links[stateData.linkId].used = true;
        links[stateData.linkId].connectedEmail = email;
        links[stateData.linkId].connectedAt = Date.now();
        saveLinks(links);
      }

      // Redirect to frontend success page
      const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
      return res.redirect(`${baseUrl}/connections/${stateData.linkId}/success`);
    }

    // Owner flow — save as primary tokens
    saveTokens(tokens);
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
    res.redirect(`${baseUrl}/oauth/success`);
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Error during authentication');
  }
});

// Check connection status (for the admin/owner)
app.get('/api/connections', (req, res) => {
  const links = loadLinks();
  const connections = Object.entries(links).map(([id, data]) => ({
    id,
    ...data,
    expired: Date.now() > data.expiresAt,
  }));
  res.json(connections);
});

// Check if owner is already connected
app.get('/api/auth/status', (req, res) => {
  const hasTokens = fs.existsSync(TOKEN_PATH);
  res.json({ connected: hasTokens });
});

// =====================
// CALENDAR ROUTES
// =====================

const getCalendarService = () => google.calendar({ version: 'v3', auth: oauth2Client });

app.post('/api/check-availability', async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });
    }

    const calendar = getCalendarService();
    const timeMin = new Date(`${date}T09:00:00Z`);
    const timeMax = new Date(`${date}T18:00:00Z`);

    const response = await calendar.freebusy.query({
      resource: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        timeZone: 'UTC',
        items: [{ id: 'primary' }],
      },
    });

    const busySlots = response.data.calendars.primary.busy;
    const availableSlots = [];
    let currentSlot = new Date(timeMin);

    while (currentSlot < timeMax) {
      const nextSlot = new Date(currentSlot.getTime() + 60 * 60 * 1000);
      const isBusy = busySlots.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return currentSlot < busyEnd && nextSlot > busyStart;
      });
      if (!isBusy) {
        availableSlots.push(currentSlot.toISOString().substr(11, 5));
      }
      currentSlot = nextSlot;
    }

    res.json({ date, available_slots: availableSlots });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check calendar availability', details: error.message });
  }
});

app.post('/api/schedule-meeting', async (req, res) => {
  try {
    const { date, time, email, name } = req.body;
    if (!date || !time || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const calendar = getCalendarService();
    const startTime = new Date(`${date}T${time}:00Z`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Meeting with ${name || email}`,
      description: `Scheduled via Voice Agent. Contact: ${email}`,
      start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
      end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
      attendees: [{ email }],
    };

    const result = await calendar.events.insert({ calendarId: 'primary', resource: event });
    res.json({ success: true, message: 'Meeting scheduled successfully', link: result.data.htmlLink });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ error: 'Failed to schedule meeting', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
