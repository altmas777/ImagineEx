import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.config({
    cloud_name: 'dtnpvm70m',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 25 beautiful AI art style images from Picsum (deterministic seeds for variety)
const IMAGE_SEEDS = [
    { url: 'https://picsum.photos/seed/ai1/800/600', prompt: 'A futuristic neon city skyline at night, cyberpunk aesthetic' },
    { url: 'https://picsum.photos/seed/ai2/800/1000', prompt: 'Magical forest with glowing mushrooms and fireflies' },
    { url: 'https://picsum.photos/seed/ai3/900/700', prompt: 'Abstract oil painting of ocean waves at sunset' },
    { url: 'https://picsum.photos/seed/ai4/800/800', prompt: 'Photorealistic dragon soaring above misty mountains' },
    { url: 'https://picsum.photos/seed/ai5/700/900', prompt: 'Digital art portrait of a woman with galaxy in her eyes' },
    { url: 'https://picsum.photos/seed/ai6/1000/700', prompt: 'Ancient temple ruins covered in vines, cinematic light' },
    { url: 'https://picsum.photos/seed/ai7/800/600', prompt: 'Anime-style samurai in cherry blossom rain' },
    { url: 'https://picsum.photos/seed/ai8/600/800', prompt: 'Surreal floating islands in a pastel sky' },
    { url: 'https://picsum.photos/seed/ai9/900/600', prompt: 'Ultra-realistic wolf howling at aurora borealis' },
    { url: 'https://picsum.photos/seed/ai10/800/800', prompt: 'Steampunk airship fleet over Victorian London' },
    { url: 'https://picsum.photos/seed/ai11/700/900', prompt: 'Deep ocean bioluminescent creatures, 8k render' },
    { url: 'https://picsum.photos/seed/ai12/1000/700', prompt: 'Space colony on Mars at sunrise, concept art' },
    { url: 'https://picsum.photos/seed/ai13/800/600', prompt: 'Watercolor painting of a cozy Japanese street in rain' },
    { url: 'https://picsum.photos/seed/ai14/600/900', prompt: 'Mechanical angel with golden wings, baroque style' },
    { url: 'https://picsum.photos/seed/ai15/900/700', prompt: 'Hyperrealistic portrait of an elf warrior in moonlight' },
    { url: 'https://picsum.photos/seed/ai16/800/800', prompt: 'Galaxy-filled portal in a dark enchanted forest' },
    { url: 'https://picsum.photos/seed/ai17/700/600', prompt: 'Art nouveau illustration of a mystical phoenix' },
    { url: 'https://picsum.photos/seed/ai18/800/1000', prompt: 'Neon underwater city with glowing coral and mermaids' },
    { url: 'https://picsum.photos/seed/ai19/1000/700', prompt: 'Cinematic battle scene with knights and dragons' },
    { url: 'https://picsum.photos/seed/ai20/800/600', prompt: 'Impressionist sunset painting over lavender fields' },
    { url: 'https://picsum.photos/seed/ai21/600/800', prompt: 'Futuristic robot meditating in a Zen garden' },
    { url: 'https://picsum.photos/seed/ai22/900/700', prompt: 'Haunted mansion in a thunderstorm, gothic atmosphere' },
    { url: 'https://picsum.photos/seed/ai23/800/800', prompt: 'Photorealistic portrait of a wise old wizard' },
    { url: 'https://picsum.photos/seed/ai24/700/900', prompt: 'Crystal cave with glowing gemstones, fantasy art' },
    { url: 'https://picsum.photos/seed/ai25/1000/700', prompt: 'Cyberpunk street market with holographic signs' },
];

// Download image to local file
const downloadImage = (url, dest) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
        // Follow redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
            file.close();
            fs.unlinkSync(dest);
            downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            return;
        }
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
        fs.unlinkSync(dest);
        reject(err);
    });
});

// Upload from URL to Cloudinary directly
const uploadImageToCloudinary = async (imageUrl, prompt) => {
    const tempPath = path.join(__dirname, `temp_${crypto.randomUUID()}.jpg`);
    
    console.log(`  📥 Downloading: ${imageUrl}`);
    await downloadImage(imageUrl, tempPath);
    
    console.log(`  ☁️  Uploading to Cloudinary...`);
    const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'imaginex',
        resource_type: 'image',
    });

    fs.unlinkSync(tempPath);
    console.log(`  ✅ Uploaded: ${result.secure_url}`);
    return result.secure_url;
};

const seed = async () => {
    console.log('\n🚀 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!\n');

    const UserCollection = mongoose.connection.collection('users');
    const PostCollection = mongoose.connection.collection('posts');

    // Get all users
    const users = await UserCollection.find({}, { projection: { _id: 1, name: 1 } }).toArray();
    console.log(`👥 Found ${users.length} users: ${users.map(u => u.name).join(', ')}\n`);

    if (users.length === 0) {
        console.log('❌ No users found. Register some users first!');
        process.exit(1);
    }

    // Shuffle images so different users get different images
    const shuffled = [...IMAGE_SEEDS].sort(() => Math.random() - 0.5);
    
    let imgIndex = 0;
    let totalCreated = 0;

    for (const user of users) {
        console.log(`\n📸 Creating 5 posts for user: ${user.name}`);
        
        for (let i = 0; i < 5; i++) {
            const imageData = shuffled[imgIndex % shuffled.length];
            imgIndex++;

            try {
                const cloudinaryUrl = await uploadImageToCloudinary(imageData.url, imageData.prompt);

                await PostCollection.insertOne({
                    user: user._id,
                    imageLink: cloudinaryUrl,
                    Prompt: imageData.prompt,
                    likes: [],
                    isPublished: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                totalCreated++;
                console.log(`  [${i + 1}/5] ✅ Post created for ${user.name}`);
            } catch (err) {
                console.error(`  [${i + 1}/5] ❌ Failed for ${user.name}:`, err.message);
            }
        }
    }

    console.log(`\n🎉 Seeding complete! Created ${totalCreated} posts across ${users.length} users.`);
    console.log('🖼️  Refresh your Gallery page to see all the images!\n');
    process.exit(0);
};

seed().catch(err => {
    console.error('❌ Seed Error:', err);
    process.exit(1);
});
