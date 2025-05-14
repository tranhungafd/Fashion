const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  secondaryImages: [{ type: String }],
  sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] }],
  richDescription: { type: String },
  colors: [{ 
    type: String, 
    enum: ['trắng', 'đen', 'kem', 'đỏ', 'hồng', 'xanh lá', 'xanh', 'tím', 'vàng', 'PASTEL', 'bạc', 'mint', 'cam', 'nâu', 'xanh rêu'] 
  }],
  occasions: [{ 
    type: String, 
    enum: ['Dự tiệc cưới', 'Hội thảo/ Thuyết trình', 'Bar/Pub', 'Du lịch Biển', 'Du lịch lạnh', 'Cafe/Tại nhà', 'Đồ cưới', 'Sự Kiện'] 
  }],
  styles: [{ 
    type: String, 
    enum: ['Thanh lịch', 'Sang Trọng', 'Sexy', 'Cá tính', 'Vintage - Boho', 'Nàng thơ - Công Chúa', 'Nhẹ Nhàng', 'Trẻ trung', 'Kín đáo'] 
  }],
  categories: [{ 
    type: String, 
    enum: ['Đầm', 'Set Bộ', 'Áo dài - Đồ lam', 'Kiểu tay áo', 'Áo', 'Vest', 'Quần', 'Chân váy', 'Đồ Liền Thân', 'Ôm Body', 'Đồ Lụa', 'Đồ Lanh'] 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);