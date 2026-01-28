import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-agent-builder');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.warn('⚠️ Server continuing in non-persistent mode (using in-memory storage).');
    // process.exit(1); // Allow server to start even if DB fails
  }
};