const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to DevAPIStore Backend!' });
});

// Uploads static folder
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

// PayPal Config Route
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`El server esta corriendo por el puerto ${PORT}`);
});
