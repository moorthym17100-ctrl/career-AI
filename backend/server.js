require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const careerRoutes = require('./routes/career');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const agentsRoutes = require('./routes/agents');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection with improved error handling for Serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ MongoDB connected successfully');
        } catch (err) {
            console.error('⚠️ MongoDB connection error:', err.message);
        }
    } else {
        console.log('⚠️ MONGODB_URI not provided. Running in Mock local mode.');
    }
};

// Middleware to ensure DB connection attempt (without blocking)
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (e) {
        console.error('DB Connection middleware error:', e);
    }
    next();
});

// Routes
app.use('/api/career', careerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running', 
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (mock mode)' 
    });
});

// Global Error Handler to prevent 500 crashes
app.use((err, req, res, next) => {
    console.error('UNHANDLED ERROR:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal Server Error', 
        message: err.message,
        path: req.path
    });
});

// Start server (only in local)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;