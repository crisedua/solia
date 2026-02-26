import { google } from 'googleapis';
import { getClient, upsertClient } from '../lib/store.js';
import { createOAuth2Client } from '../lib/google.js';

const SHEET_NAME = 'Sol-IA Llamadas';
const HEADERS = ['Fecha', 'Hora', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Notas'];

async function getOrCreateSheet(auth, client) {
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = client.sheetId;

  if (sheetId) {
    try {
      await sheets.spreadsheets.get({ spreadsheetId: sheetId });
      return sheetId;
    } catch (_) { }
  }

  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: { title: `${client.business} - Sol-IA Contactos` },
      sheets: [{ properties: { title: SHEET_NAME } }],
    },
  });

  const newSheetId = spreadsheet.data.spreadsheetId;

  await sheets.spreadsheets.values.update({
    spreadsheetId: newSheetId,
    range: `${SHEET_NAME}!A1:G1`,
    valueInputOption: 'RAW',
    resource: { values: [HEADERS] },
  });

  await upsertClient(client.id, { sheetId: newSheetId });
  return newSheetId;
}

async function appendToSheet(auth, client, data) {
  const sheetId = await getOrCreateSheet(auth, client);
  const sheets = google.sheets({ version: 'v4', auth });

  const now = new Date();
  const row = [
    now.toLocaleDateString('es-CL'),
    now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    data.caller_name || '',
    data.caller_email || '',
    data.caller_phone || '',
    data.type || 'Llamada',
    data.notes || '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${SHEET_NAME}!A:G`,
    valueInputOption: 'RAW',
    resource: { values: [row] },
  });
}

function extractContactInfo(transcript) {
  const text = transcript.toLowerCase();
  const info = { caller_name: '', caller_email: '', caller_phone: '', notes: '' };

  // Extract email
  const emailMatch = transcript.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  if (emailMatch) info.caller_email = emailMatch[0];

  // Extract phone (Chilean format)
  const phoneMatch = transcript.match(/\+?56\s?9?\s?\d{4}\s?\d{4}|\d{9}/);
  if (phoneMatch) info.caller_phone = phoneMatch[0].replace(/\s/g, '');

  // Extract property preferences for notes
  const preferences = [];
  if (text.includes('casa')) preferences.push('casa');
  if (text.includes('departamento') || text.includes('depto')) preferences.push('departamento');
  if (text.includes('parcela')) preferences.push('parcela');
  if (text.includes('compra')) preferences.push('compra');
  if (text.includes('arriendo') || text.includes('arrendar')) preferences.push('arriendo');
  if (text.includes('concón')) preferences.push('Concón');
  if (text.includes('quintero')) preferences.push('Quintero');
  if (text.includes('viña')) preferences.push('Viña del Mar');
  if (text.includes('frente al mar') || text.includes('vista al mar')) preferences.push('frente al mar');

  info.notes = preferences.join(', ');

  return info;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  console.log('[ElevenLabs Webhook] Received:', JSON.stringify(req.body));

  try {
    const { transcript, agent_id } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'No transcript provided' });
    }

    // Get client (using the test client for now)
    const clientId = 'fa78Rv45yUXstIA9';
    const client = await getClient(clientId);

    if (!client || !client.tokens) {
      console.error('[ElevenLabs Webhook] Client not found or no tokens');
      return res.status(200).json({ message: 'Client not configured' });
    }

    // Extract contact info from transcript
    const contactInfo = extractContactInfo(transcript);

    // Try to extract name from transcript (look for "mi nombre es" or similar)
    const namePatterns = [
      /mi nombre es ([a-záéíóúñ\s]+)/i,
      /me llamo ([a-záéíóúñ\s]+)/i,
      /soy ([a-záéíóúñ\s]+)/i,
    ];

    for (const pattern of namePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        contactInfo.caller_name = match[1].trim().split(/\s+/).slice(0, 3).join(' ');
        break;
      }
    }

    // Only save if we have at least a name or email or phone
    if (contactInfo.caller_name || contactInfo.caller_email || contactInfo.caller_phone) {
      const oauth2Client = createOAuth2Client();
      oauth2Client.setCredentials(client.tokens);

      oauth2Client.on('tokens', async (newTokens) => {
        try {
          await upsertClient(clientId, { tokens: { ...client.tokens, ...newTokens } });
        } catch (e) {
          console.error('[ElevenLabs Webhook] Token save error:', e.message);
        }
      });

      await appendToSheet(oauth2Client, client, {
        ...contactInfo,
        type: 'Llamada ElevenLabs',
      });

      console.log('[ElevenLabs Webhook] Contact saved:', contactInfo);
      return res.json({ success: true, message: 'Contact saved to sheet' });
    } else {
      console.log('[ElevenLabs Webhook] No contact info found in transcript');
      return res.json({ success: false, message: 'No contact info extracted' });
    }
  } catch (error) {
    console.error('[ElevenLabs Webhook] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
