// Script to create a coordinating agency user
// Run with: node create-user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  userType: { type: String, required: true },
  organizationName: { type: String },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createUser() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/afcf_database';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'ca@email.com' });
    if (existingUser) {
      console.log('⚠️  User already exists. Updating password...');
      const passwordHash = await bcrypt.hash('123456', 12); // Minimum 6 chars
      existingUser.passwordHash = passwordHash;
      await existingUser.save();
      console.log('✅ Password updated successfully');
      console.log('📧 Email: ca@email.com');
      console.log('🔑 Password: 123456 (updated from 1234 to meet minimum requirements)');
    } else {
      // Create new user
      const passwordHash = await bcrypt.hash('123456', 12); // Minimum 6 chars
      const user = await User.create({
        email: 'ca@email.com',
        passwordHash: passwordHash,
        firstName: 'Coordinating',
        lastName: 'Agency',
        userType: 'coordinating_agency',
        organizationName: 'AFCF Coordinating Agency',
        isActive: true,
        isVerified: true
      });
      console.log('✅ User created successfully');
      console.log('📧 Email: ca@email.com');
      console.log('🔑 Password: 123456 (used instead of 1234 to meet minimum requirements)');
      console.log('👤 User Type: coordinating_agency');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUser();

