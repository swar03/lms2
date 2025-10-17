const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);

// Profile route - temporary test version
router.get('/profile', async (req, res) => {
  try {
    res.json({ 
      message: 'Profile route working!', 
      user: {
        id: '1',
        name: 'Test User',
        email: 'user@example.com',
        role: 'STUDENT'
      }
    });
  } catch (err) {
    console.error('Error in /profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
