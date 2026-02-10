module.exports = (req, res) => {
  // Note: In production, check if user has stored tokens
  // For now, return false
  res.json({ connected: false });
};
