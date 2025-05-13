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

// Middleware để chặn truy cập admin.html nếu chưa đăng nhập
app.use('/pages', (req, res, next) => {
  if (req.url === '/admin.html') {
    const token = req.query.token || req.headers['authorization'];
    if (!token) {
      console.log('Accessing admin.html without token');
      return res.status(403).sendFile(path.join(__dirname, '../frontend/pages/error.html'));
    }
  }
  next();
}, express.static(path.join(__dirname, '../frontend/pages')));

app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

app.get('/', (req, res) => {
  res.redirect('/pages/index.html');
});

app.get('/admin', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

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

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack); // Hiển thị stack trace để debug
  res.status(500).send('Something broke! Please try again later.');
});

// Xử lý lỗi không đồng bộ
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));