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
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    const { name, description, price } = req.body;
    const product = new Product({
      name,
      description,
      price,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    console.log('Product to save:', product);
    await product.save();
    console.log('Product saved successfully');
    res.status(201).json({ message: 'Product uploaded successfully' });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ error: 'Error uploading product' });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Fetching products...'); // Thêm log để debug
    const products = await Product.find();
    console.log('Products found:', products); // Thêm log để kiểm tra dữ liệu
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

module.exports = router;