const { getAllClients } = require('../lib/store');

module.exports = (req, res) => {
  // Simple admin auth
  const authHeader = req.headers['x-admin-key'];
  if (authHeader !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const clients = getAllClients();
  const list = Object.values(clients).map((c) => ({
    id: c.id,
    name: c.name,
    business: c.business,
    email: c.email,
    calendarConnected: c.calendarConnected,
    gmailConnected: c.gmailConnected,
    connectedEmail: c.connectedEmail,
    connectedAt: c.connectedAt,
    createdAt: c.createdAt,
    agentId: c.agentId || null,
  }));

  res.json(list);
};
