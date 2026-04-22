import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './server/routes/authRoutes.js'; // Just to ensure esm or whatever

// load env
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to DB, dropping stale indexes...");
    try {
        await mongoose.connection.collection('users').dropIndex('phoneNumber_1');
        console.log("Stale phoneNumber_1 index dropped successfully!");
    } catch (err) {
        console.log("Index might already be dropped or not found:", err.message);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
