// ========== DATABASE IMPORTS (COMMENTED FOR API-ONLY MODE) ==========
// const Song = require('../models/Song');
// const User = require('../models/User');
// const Order = require('../models/Order');
// ======================================================================

const iTunesService = require('../services/itunesService');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
// @query   page - Page number (optional, default: 1)
// @query   limit - Results per page (optional, default: 20)
const getSongs = async (req, res) => {
    // ========== DATABASE VERSION (COMMENTED) ==========
    // try {
    //     const page = parseInt(req.query.page) || 1;
    //     const limit = parseInt(req.query.limit) || 20;
    //     const skip = (page - 1) * limit;
    //
    //     const songs = await Song.find({})
    //         .sort({ createdAt: -1 })
    //         .skip(skip)
    //         .limit(limit);
    //
    //     const total = await Song.countDocuments({});
    //
    //     res.json({
    //         success: true,
    //         data: songs,
    //         pagination: {
    //             page,
    //             limit,
    //             total,
    //             pages: Math.ceil(total / limit),
    //         },
    //     });
    // } catch (error) {
    //     console.error('Get songs error:', error);
    //     res.status(500).json({
    //         success: false,
    //         message: 'Failed to fetch songs',
    //     });
    // }
    // ==================================================

    // API-ONLY VERSION: Return empty or use trending search
    try {
        const { genre = 'pop', limit = 20 } = req.query;
        // Get trending songs from iTunes by searching popular terms
        const iTunesTracks = await iTunesService.searchTracks(genre, {
            limit: parseInt(limit),
        });

        res.json({
            success: true,
            data: iTunesTracks,
            pagination: {
                page: 1,
                limit: iTunesTracks.length,
                total: iTunesTracks.length,
                pages: 1,
            },
        });
    } catch (error) {
        console.error('Get songs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch songs',
        });
    }
};

// @desc    Get recently played songs
// @route   GET /api/songs/recent
// @access  Public
// @query   limit - Maximum results (optional, default: 10)
const getRecentlyPlayed = async (req, res) => {
    // ========== DATABASE VERSION (COMMENTED) ==========
    // try {
    //     const limit = parseInt(req.query.limit) || 10;
    //     const songs = await Song.find({ lastPlayed: { $exists: true } })
    //         .sort({ lastPlayed: -1 })
    //         .limit(limit);
    //
    //     res.json({
    //         success: true,
    //         count: songs.length,
    //         songs,
    //     });
    // } catch (error) {
    //     console.error('Get recently played error:', error);
    //     res.status(500).json({
    //         success: false,
    //         message: 'Failed to fetch recent songs',
    //     });
    // }
    // ==================================================

    // API-ONLY VERSION: Return trending/popular songs
    try {
        const limit = parseInt(req.query.limit) || 10;
        // Get popular songs from iTunes
        const iTunesTracks = await iTunesService.searchTracks('popular', {
            limit,
        });

        res.json({
            success: true,
            count: iTunesTracks.length,
            songs: iTunesTracks,
        });
    } catch (error) {
        console.error('Get recently played error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent songs',
        });
    }
};

// @desc    Get recommended songs
// @route   GET /api/songs/recommended
// @access  Public
// @query   limit - Maximum results (optional, default: 10)
const getRecommended = async (req, res) => {
    // ========== DATABASE VERSION (COMMENTED) ==========
    // try {
    //     const limit = parseInt(req.query.limit) || 10;
    //     // Recommendation based on most played songs
    //     // TODO: Enhance with user-based recommendations using listening history
    //     const songs = await Song.find({ playCount: { $gt: 0 } })
    //         .sort({ playCount: -1, lastPlayed: -1 })
    //         .limit(limit);
    //
    //     res.json({
    //         success: true,
    //         count: songs.length,
    //         songs,
    //     });
    // } catch (error) {
    //     console.error('Get recommended error:', error);
    //     res.status(500).json({
    //         success: false,
    //         message: 'Failed to fetch recommended songs',
    //     });
    // }
    // ==================================================

    // API-ONLY VERSION: Return recommended songs from iTunes
    try {
        const limit = parseInt(req.query.limit) || 10;
        // Get recommended songs from iTunes (top charts)
        const iTunesTracks = await iTunesService.searchTracks('top', {
            limit,
        });

        res.json({
            success: true,
            count: iTunesTracks.length,
            songs: iTunesTracks,
        });
    } catch (error) {
        console.error('Get recommended error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recommended songs',
        });
    }
};

// @desc    Search for songs using iTunes API
// @route   GET /api/songs/search
// @access  Public
// @query   q - Search query (required)
// @query   limit - Maximum results (optional, default: 25)
// @query   country - Country code for iTunes (optional, default: 'us')
const searchSongs = async (req, res) => {
    try {
        const { q, limit = 25, country = 'us' } = req.query;

        // Validate query parameter
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Search query is required' 
            });
        }

        // ========== DATABASE VERSION (COMMENTED) ==========
        // // 1. Search local database first for cached results
        // const localSongs = await Song.find({
        //     $or: [
        //         { title: { $regex: q.trim(), $options: 'i' } },
        //         { artist: { $regex: q.trim(), $options: 'i' } },
        //         { album: { $regex: q.trim(), $options: 'i' } },
        //     ],
        // }).limit(parseInt(limit));
        //
        // // 2. Search iTunes API for additional results
        // let iTunesTracks = [];
        // try {
        //     iTunesTracks = await iTunesService.searchTracks(q, {
        //         limit: parseInt(limit),
        //         country: country.toLowerCase(),
        //     });
        // } catch (iTunesError) {
        //     console.error('iTunes search error:', iTunesError.message);
        //     // If iTunes fails, return local results only
        //     if (localSongs.length === 0) {
        //         return res.status(503).json({
        //             success: false,
        //             message: 'Search service temporarily unavailable',
        //             songs: [],
        //         });
        //     }
        // }
        //
        // // 3. Upsert iTunes tracks to local database
        // const upsertPromises = iTunesTracks
        //     .filter(track => iTunesService.isValidTrack(track))
        //     .map(async (trackData) => {
        //         try {
        //             // Use trackId for unique identification if available
        //             const query = trackData.trackId
        //                 ? { trackId: trackData.trackId }
        //                 : {
        //                     title: trackData.title,
        //                     artist: trackData.artist,
        //                     album: trackData.album || 'Unknown',
        //                 };
        //
        //             const song = await Song.findOneAndUpdate(
        //                 query,
        //                 {
        //                     $set: {
        //                         ...trackData,
        //                         // Don't overwrite playCount and lastPlayed if song exists
        //                     },
        //                     $setOnInsert: {
        //                         playCount: 0,
        //                     },
        //                 },
        //                 {
        //                     upsert: true,
        //                     new: true,
        //                     runValidators: true,
        //                 }
        //             );
        //             return song;
        //         } catch (error) {
        //             console.error('Error upserting song:', error.message);
        //             return null;
        //         }
        //     });
        //
        // const newSongs = await Promise.all(upsertPromises);
        // const validNewSongs = newSongs.filter(song => song !== null);
        //
        // // 4. Combine and deduplicate results
        // const allSongs = [...localSongs, ...validNewSongs];
        // const songMap = new Map();
        //
        // allSongs.forEach(song => {
        //     const key = song.trackId
        //         ? `trackId_${song.trackId}`
        //         : `${song.title}_${song.artist}_${song.album || ''}`;
        //
        //     if (!songMap.has(key)) {
        //         songMap.set(key, song);
        //     } else {
        //         // Keep the one with more data (prefer iTunes data)
        //         const existing = songMap.get(key);
        //         if (song.source === 'itunes' && existing.source !== 'itunes') {
        //             songMap.set(key, song);
        //         }
        //     }
        // });
        //
        // const uniqueSongs = Array.from(songMap.values());
        //
        // // 5. Sort by relevance (songs with trackId first, then by title match)
        // uniqueSongs.sort((a, b) => {
        //     const aHasTrackId = a.trackId ? 1 : 0;
        //     const bHasTrackId = b.trackId ? 1 : 0;
        //     if (aHasTrackId !== bHasTrackId) {
        //         return bHasTrackId - aHasTrackId;
        //     }
        //     return a.title.localeCompare(b.title);
        // });
        //
        // res.json({
        //     success: true,
        //     count: uniqueSongs.length,
        //     songs: uniqueSongs.slice(0, parseInt(limit)),
        // });
        // ==================================================

        // API-ONLY VERSION: Search directly from iTunes API
        const iTunesTracks = await iTunesService.searchTracks(q, {
            limit: parseInt(limit),
            country: country.toLowerCase(),
        });

        // Deduplicate by trackId
        const songMap = new Map();
        iTunesTracks.forEach(track => {
            if (track.trackId && !songMap.has(track.trackId)) {
                songMap.set(track.trackId, track);
            } else if (!track.trackId) {
                const key = `${track.title}_${track.artist}_${track.album || ''}`;
                if (!songMap.has(key)) {
                    songMap.set(key, track);
                }
            }
        });

        const uniqueSongs = Array.from(songMap.values());

        res.json({
            success: true,
            count: uniqueSongs.length,
            songs: uniqueSongs.slice(0, parseInt(limit)),
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search songs',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

// @desc    Get song by ID with full details
// @route   GET /api/songs/:id
// @access  Public
// @query   trackId - iTunes track ID (required for API-only mode)
// @query   country - Country code (optional, default: 'us')
const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackId, country = 'us' } = req.query;

        // ========== DATABASE VERSION (COMMENTED) ==========
        // // Try to find in local database first
        // let song = await Song.findById(id);
        //
        // // If not found locally but has trackId, try to fetch from iTunes
        // if (!song && req.query.trackId) {
        //     try {
        //         const iTunesTrack = await iTunesService.getTrackById(
        //             parseInt(req.query.trackId),
        //             req.query.country || 'us'
        //         );
        //         if (iTunesTrack) {
        //             // Save to database
        //             song = await Song.findOneAndUpdate(
        //                 { trackId: iTunesTrack.trackId },
        //                 { $set: iTunesTrack },
        //                 { upsert: true, new: true }
        //             );
        //         }
        //     } catch (iTunesError) {
        //         console.error('iTunes lookup error:', iTunesError.message);
        //     }
        // }
        //
        // if (!song) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Song not found',
        //     });
        // }
        // ==================================================

        // API-ONLY VERSION: Fetch directly from iTunes using trackId
        const iTunesTrackId = trackId || id;
        
        if (!iTunesTrackId || isNaN(parseInt(iTunesTrackId))) {
            return res.status(400).json({
                success: false,
                message: 'trackId parameter is required (iTunes track ID)',
            });
        }

        const song = await iTunesService.getTrackById(
            parseInt(iTunesTrackId),
            country
        );

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found',
            });
        }

        res.json({
            success: true,
            song,
        });
    } catch (error) {
        console.error('Get song by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch song',
        });
    }
};

// @desc    Update song play count and last played time
// @route   POST /api/songs/:id/play
// @access  Public
// @query   trackId - iTunes track ID (required for API-only mode)
// @query   country - Country code (optional, default: 'us')
const playSong = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackId, country = 'us' } = req.query;

        // ========== DATABASE VERSION (COMMENTED) ==========
        // const song = await Song.findById(id);
        //
        // if (!song) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Song not found',
        //     });
        // }
        //
        // song.playCount = (song.playCount || 0) + 1;
        // song.lastPlayed = new Date();
        // await song.save();
        //
        // res.json({
        //     success: true,
        //     song,
        // });
        // ==================================================

        // API-ONLY VERSION: Just return success (no database tracking)
        const iTunesTrackId = trackId || id;
        
        if (!iTunesTrackId || isNaN(parseInt(iTunesTrackId))) {
            return res.status(400).json({
                success: false,
                message: 'trackId parameter is required (iTunes track ID)',
            });
        }

        // Fetch song info from iTunes
        const song = await iTunesService.getTrackById(
            parseInt(iTunesTrackId),
            country
        );

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found',
            });
        }

        // In API-only mode, we just acknowledge the play
        // No database tracking is performed
        res.json({
            success: true,
            message: 'Play tracked successfully (API-only mode)',
            song,
        });
    } catch (error) {
        console.error('Play song error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track play',
        });
    }
};

// @desc    Create order for a song
// @route   POST /api/songs/order
// @access  Public
// @body    userId - User ID (optional in API-only mode)
// @body    songId - Song ID or iTunes trackId
// @body    trackId - iTunes track ID (required for API-only mode)
// @body    country - Country code (optional, default: 'us')
const orderSong = async (req, res) => {
    try {
        const { userId, songId, trackId, country = 'us' } = req.body;

        // ========== DATABASE VERSION (COMMENTED) ==========
        // if (!userId || !songId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'userId and songId are required',
        //     });
        // }
        //
        // // In a real app, you would get the user from auth middleware
        // const user = await User.findById(userId);
        // const song = await Song.findById(songId);
        //
        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'User not found',
        //     });
        // }
        //
        // if (!song) {
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Song not found',
        //     });
        // }
        //
        // const order = await Order.create({
        //     user: user._id,
        //     song: song._id,
        // });
        //
        // res.status(201).json({
        //     success: true,
        //     order,
        // });
        // ==================================================

        // API-ONLY VERSION: Just validate and return success
        const iTunesTrackId = trackId || songId;
        
        if (!iTunesTrackId) {
            return res.status(400).json({
                success: false,
                message: 'trackId or songId is required',
            });
        }

        // Fetch song info from iTunes to validate
        const song = await iTunesService.getTrackById(
            parseInt(iTunesTrackId),
            country
        );

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found',
            });
        }

        // In API-only mode, we just acknowledge the order
        // No database storage is performed
        res.status(201).json({
            success: true,
            message: 'Order created successfully (API-only mode)',
            order: {
                userId: userId || 'guest',
                song: song,
                createdAt: new Date(),
            },
        });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
        });
    }
};


module.exports = {
    getSongs,
    getSongById,
    getRecentlyPlayed,
    getRecommended,
    searchSongs,
    playSong,
    orderSong,
};
