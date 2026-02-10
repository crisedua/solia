const crypto = require('crypto');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const linkId = crypto.randomBytes(16).toString('base64url');
  const expiresAt = Date.now() + 72 * 60 * 60 * 1000; // 72 hours

  // Note: In production, you'd store this in a database or Vercel KV
  // For now, we'll just generate the link
  const baseUrl = process.env.APP_BASE_URL || 'https://solia.vercel.app';
  const shareUrl = `${baseUrl}/connections/${linkId}`;

  res.json({
    linkId,
    url: shareUrl,
    expiresAt: new Date(expiresAt).toISOString(),
    expiresInHours: 72,
  });
};
