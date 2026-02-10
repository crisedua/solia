/**
 * Simple JSON-based store using Vercel Blob or KV.
 * For MVP, we use an in-memory fallback + environment-based persistence.
 * In production, replace with Vercel KV (@vercel/kv) or a database.
 *
 * Data structure:
 * clients: {
 *   [clientId]: {
 *     id, name, business, email, phone,
 *     createdAt, agentId,
 *     calendarConnected, gmailConnected,
 *     tokens: { access_token, refresh_token, ... },
 *     connectedEmail, connectedAt
 *   }
 * }
 */

// For Vercel serverless, we need external storage.
// Using Vercel KV if available, otherwise fallback to a JSON file approach via /tmp
const fs = require('fs');
const path = require('path');

const STORE_PATH = '/tmp/solia-clients.json';

function loadClients() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    }
  } catch (_) {}
  return {};
}

function saveClients(clients) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(clients, null, 2));
}

function getClient(clientId) {
  const clients = loadClients();
  return clients[clientId] || null;
}

function upsertClient(clientId, data) {
  const clients = loadClients();
  clients[clientId] = { ...clients[clientId], ...data };
  saveClients(clients);
  return clients[clientId];
}

function getAllClients() {
  return loadClients();
}

module.exports = { getClient, upsertClient, getAllClients, loadClients, saveClients };
