// routes/protectedRoute.js
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/auth/protected
// @desc    Protected route example
router.get('/protected', auth, (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route!' });
});

module.exports = router;
