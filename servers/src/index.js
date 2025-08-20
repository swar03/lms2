const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import the correct authentication routes
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Use the Google OAuth routes for any requests to /api/auth/...
app.use('/api', authRoutes);

// NOTE: The /api/courses route and instructor logic will need attention next,
// as the Google sign-in currently only creates STUDENT roles.
// This part of the code is kept for now but will require a way to set instructor roles.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));