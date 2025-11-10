import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/afcf_database';

mongoose.set('strictQuery', true);

mongoose.connect(mongoUri, {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
}).then(() => {
  console.log('✅ MongoDB connection established successfully');
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('⚠️  Make sure MongoDB is running or update MONGO_URI in .env');
  console.error('💡 For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/database');
  // Don't exit - allow server to start (connections will fail when used)
});

export default mongoose;
