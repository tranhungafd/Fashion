const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authenticateToken = require('./middleware/auth');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log đường dẫn để debug
console.log('Serving pages from:', path.join(__dirname, '../frontend/pages'));
console.log('Serving assets from:', path.join(__dirname, '../frontend/assets'));

// ⚠️ Chặn truy cập trực tiếp vào admin.html qua static
app.use('/pages', (req, res, next) => {
  if (req.path === '/admin.html') {
    return next(); // skip static middleware
  }
  express.static(path.join(__dirname, '../frontend/pages'))(req, res, next);
});

// Cấu hình static cho assets
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Redirect root to index.html
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

// ✅ Route được bảo vệ
app.get('/pages/admin.html', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
