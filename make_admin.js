import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to DB...");
    try {
        const result = await mongoose.connection.collection('users').updateOne(
            { name: 'altmas' }, // Change this to your username
            { $set: { isAdmin: true } }
        );
        if (result.modifiedCount > 0) {
            console.log("✅ User 'altmas' has been made Admin successfully!");
        } else {
            console.log("⚠️  User not found. Make sure the name matches exactly.");
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
