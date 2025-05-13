const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authenticateToken = require('./middleware/auth');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Chỉ phục vụ các trang không nhạy cảm qua static
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages'), {
  setHeaders: (res) => {
    if (res.req.url === '/admin.html') {
      res.statusCode = 403;
      res.end('Access denied. Please log in.');
    }
  }
}));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Redirect root to index.html
app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

// Route bảo vệ để trả về admin.html
app.get('/admin', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));