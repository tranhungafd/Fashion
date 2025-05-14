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

router.post('/', authenticateToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'secondaryImages', maxCount: 5 }
]), async (req, res) => {
  try {
    console.log('Request body (full):', req.body);
    console.log('Files:', req.files);

    const { name, description, price, sizes, richDescription, colors, occasions, styles, categories } = req.body;
    if (!name || !description || !price) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: name, description, price are required' });
    }

    if (!req.files['image']) {
      console.log('Missing main image');
      return res.status(400).json({ error: 'Main image is required' });
    }

    // Hàm parse mảng, xử lý chuỗi JSON
    const parseArray = (value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
          return value ? [value] : [];
        }
      }
      return value ? (Array.isArray(value) ? value : [value]) : [];
    };

    const product = new Product({
      name,
      description,
      price: parseFloat(price), // Chuyển price thành số
      image: req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '',
      secondaryImages: req.files['secondaryImages'] ? req.files['secondaryImages'].map(file => `/uploads/${file.filename}`) : [],
      sizes: parseArray(sizes),
      richDescription: richDescription || '',
      colors: parseArray(colors),
      occasions: parseArray(occasions),
      styles: parseArray(styles),
      categories: parseArray(categories),
    });

    console.log('Product to save:', product);
    await product.save();
    console.log('Product saved successfully');
    res.status(201).json({ message: 'Product uploaded successfully', product });
  } catch (error) {
    console.error('Error uploading product:', error.message, error.stack);
    res.status(500).json({ error: 'Error uploading product', details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Fetching products...');
    const products = await Product.find();
    console.log('Products found:', products);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching product with id:', req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Product found:', product);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product' });
  }
});

module.exports = router;