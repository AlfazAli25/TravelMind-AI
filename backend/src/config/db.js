import mongoose from 'mongoose';
import env from './env.js';

let cachedConnection = null;

const connectDB = async () => {
  // If connection is already established, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    cachedConnection = conn;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Throw error so the calling handler knows connection failed
    throw error;
  }
};

export default connectDB;
