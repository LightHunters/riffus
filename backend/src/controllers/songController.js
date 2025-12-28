const axios = require('axios');
const Song = require('../models/Song');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res) => {
    try {
        const songs = await Song.find({});
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get recently played songs
// @route   GET /api/songs/recent
// @access  Public
const getRecentlyPlayed = async (req, res) => {
    try {
        const songs = await Song.find().sort({ lastPlayed: -1 }).limit(10);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recent songs' });
    }
};

// @desc    Get recommended songs
// @route   GET /api/songs/recommended
// @access  Public
const getRecommended = async (req, res) => {
    try {
        // For now, recommendation is based on most played songs.
        // A better approach would be to recommend based on user's listening history.
        const songs = await Song.find().sort({ playCount: -1 }).limit(10);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recommended songs' });
    }
};

// @desc    Search for a song
// @route   GET /api/songs/search
// @access  Public
const searchSongs = async (req, res) => {
    try {
        const { q } = req.query;

        // 1. Search local DB
        const localSongs = await Song.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { artist: { $regex: q, $options: 'i' } },
                { album: { $regex: q, $options: 'i' } },
            ],
        });

        // 2. Search Deezer API
        const deezerResponse = await axios.get(`https://api.deezer.com/search`, {
            params: {
                q: q,
                limit: 25,
            },
        });

        const deezerSongs = deezerResponse.data.data.map(item => ({
            title: item.title,
            artist: item.artist.name,
            album: item.album.title,
            coverImage: item.album.cover_xl, // Get high resolution image
            previewUrl: item.preview,
        }));

        // 3. Add new songs from Deezer to local DB
        const upsertPromises = deezerSongs.map(songData =>
            Song.findOneAndUpdate(
                { title: songData.title, artist: songData.artist, album: songData.album },
                { $setOnInsert: songData },
                { upsert: true, new: true }
            )
        );
        const newSongs = await Promise.all(upsertPromises);

        // 4. Combine and de-duplicate results
        const allSongs = [...localSongs, ...newSongs.filter(s => s)]; // filter out nulls if any
        const uniqueSongs = Array.from(new Map(allSongs.map(song => [song._id.toString(), song])).values());

        res.json(uniqueSongs);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Failed to search songs' });
    }
};

// @desc    Update song play count and last played time
// @route   POST /api/songs/:id/play
// @access  Public
const playSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (song) {
            song.playCount = (song.playCount || 0) + 1;
            song.lastPlayed = new Date();
            await song.save();
            res.json(song);
        } else {
            res.status(404).json({ message: 'Song not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to play song' });
    }
};

const orderSong = async (req, res) => {
    try {
        const { userId, songId } = req.body;
        if (!userId || !songId) {
            return res.status(400).json({ message: 'userId and songId are required' });
        }
        // In a real app, you would get the user from auth middleware
        const user = await User.findById(userId);
        const song = await Song.findById(songId);

        if (!user || !song) {
            return res.status(404).json({ message: 'User or Song not found' });
        }
        const order = await Order.create({ user: user._id, song: song._id });
        res.status(201).json(order);
    } catch (err) {
        console.error('Order error:', err);
        res.status(500).json({ message: 'Failed to create order' });
    }
};


module.exports = {
    getSongs,
    getRecentlyPlayed,
    getRecommended,
    searchSongs,
    playSong,
    orderSong,
};
