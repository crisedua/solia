import fs from 'fs';

const STORE_PATH = '/tmp/solia-clients.json';

export function loadClients() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    }
  } catch (_) {}
  return {};
}

export function saveClients(clients) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(clients, null, 2));
}

export function getClient(clientId) {
  const clients = loadClients();
  return clients[clientId] || null;
}

export function upsertClient(clientId, data) {
  const clients = loadClients();
  clients[clientId] = { ...clients[clientId], ...data };
  saveClients(clients);
  return clients[clientId];
}

export function getAllClients() {
  return loadClients();
}
