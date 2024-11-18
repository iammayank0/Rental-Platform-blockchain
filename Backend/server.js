const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/authRoutes');


// Initialize the app
const app = express();

// Enable CORS for specific origin (frontend)
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend to access the API
  credentials: true, // If you need to allow credentials (cookies, auth, etc.)
}));

// Middleware to parse JSON requests
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);


// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
