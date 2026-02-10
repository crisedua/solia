module.exports = (req, res) => {
  const { linkId } = req.query;

  // Note: In production, you'd check this against a database or Vercel KV
  // For now, we'll return a valid response
  res.json({
    valid: true,
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  });
};
