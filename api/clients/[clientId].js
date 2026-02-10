const { getClient } = require('../lib/store');

module.exports = (req, res) => {
  const { clientId } = req.query;
  const client = getClient(clientId);

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  // Return safe public info (no tokens)
  res.json({
    id: client.id,
    name: client.name,
    business: client.business,
    calendarConnected: client.calendarConnected,
    gmailConnected: client.gmailConnected,
    connectedEmail: client.connectedEmail,
  });
};
