const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Ảnh chính
  secondaryImages: [{ type: String }], // Mảng ảnh phụ
  sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] }], // Mảng kích thước
  richDescription: { type: String, required: true}, // Mô tả định dạng HTML
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);