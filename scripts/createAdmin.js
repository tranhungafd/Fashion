const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path'); // Thêm dòng này
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Admin = require('../src/backend/models/admin');

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123';
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();