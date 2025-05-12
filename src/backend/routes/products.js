const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = new Product({
      name,
      description,
      price,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await product.save();
    res.status(201).json({ message: 'Product uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading product' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

module.exports = router;