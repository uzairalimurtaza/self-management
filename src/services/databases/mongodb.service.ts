// src/db.ts
import mongoose from 'mongoose';
import { MONGO_URI, MONGODB_NAME } from '../../config/config';

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}/${MONGODB_NAME}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`, ' DB : ', MONGODB_NAME);
  } catch (error: Error | any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
