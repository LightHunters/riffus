require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('./src/models/Song');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/music_cafe';

async function seed() {
    await mongoose.connect(MONGO_URI);

    await Promise.all([Song.deleteMany({}), User.deleteMany({})]);

    const songs = await Song.insertMany([
        {
            title: 'The triangle',
            artist: 'Aero Vibes',
            coverImage: 'https://images.unsplash.com/photo-1546443046-ed1ce6ffd1ab?q=80&w=600',
            streams: 114000,
            category: 'recent',
            isRecommended: true,
        },
        {
            title: 'Dune Of Visa',
            artist: 'Synth Driver',
            coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
            streams: 98000,
            category: 'recent',
            isRecommended: true,
        },
        {
            title: 'Riskitall',
            artist: 'Lofi Bear',
            coverImage: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=600',
            streams: 87000,
            category: 'recent',
            isRecommended: false,
        },
    ]);

    const user = await User.create({
        name: 'Sarwar Jahan',
        membershipType: 'Gold',
        avatar: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=200',
    });

    console.log('Seeded', { songs: songs.length, user: user.name });
    await mongoose.disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});


