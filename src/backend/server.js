const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authenticateToken = require('./middleware/auth'); // Import middleware
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log đường dẫn để debug
console.log('Serving pages from:', path.join(__dirname, '../frontend/pages'));
console.log('Serving assets from:', path.join(__dirname, '../frontend/assets'));

// Cấu hình static files
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Redirect root to index.html
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

// Bảo vệ route /pages/admin.html
app.get('/pages/admin.html', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));