import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });
import mongoose from 'mongoose';
import { User } from '../../models/user';
import { Game } from '../../models/game';
import { Match } from '../../models/match';
import { Transaction } from '../../models/transaction';
import { UserStatistics } from '../../models/userStatistics';
import { Leaderboard } from '../../models/leaderboard';
import { MONGO_URI, MONGODB_NAME } from '../../config/config';

// Replace with your MongoDB connection string
const MONGODB_URI = `${MONGO_URI}/${MONGODB_NAME}`;
console.log(MONGODB_URI);

const initializeDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize collections by creating at least one document in each
    await User.createCollection();
    await Game.createCollection();
    await Match.createCollection();
    await Transaction.createCollection();
    await UserStatistics.createCollection();
    await Leaderboard.createCollection();

    console.log('Collections created');

    // Optionally, create indexes here if needed
    // await User.createIndexes();
    // await Game.createIndexes();
    // await Match.createIndexes();
    // await Transaction.createIndexes();
    // await UserStatistics.createIndexes();
    // await Leaderboard.createIndexes();

    console.log('Indexes created');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase();
