/**
 * API-ONLY VERSION - No Database Dependencies
 * This controller works purely with iTunes API without any database operations
 * Use this file if you want to run the app without MongoDB
 */

const iTunesService = require('../services/itunesService');

// @desc    Get trending/popular songs from iTunes
// @route   GET /api/songs
// @access  Public
// @query   genre - Genre to search (optional, default: 'pop')
// @query   limit - Results per page (optional, default: 20)
const getSongs = async (req, res) => {
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

// @desc    Get recently played songs (trending from iTunes)
// @route   GET /api/songs/recent
// @access  Public
// @query   limit - Maximum results (optional, default: 10)
const getRecentlyPlayed = async (req, res) => {
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

// @desc    Get recommended songs from iTunes
// @route   GET /api/songs/recommended
// @access  Public
// @query   limit - Maximum results (optional, default: 10)
const getRecommended = async (req, res) => {
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

// @desc    Search for songs using iTunes API (API-only, no database)
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

        // Search directly from iTunes API
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

// @desc    Get song by iTunes track ID
// @route   GET /api/songs/:id
// @access  Public
// @query   trackId - iTunes track ID (can use :id param or query)
// @query   country - Country code (optional, default: 'us')
const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackId, country = 'us' } = req.query;

        // Use trackId from query or id from params
        const iTunesTrackId = trackId || id;
        
        if (!iTunesTrackId || isNaN(parseInt(iTunesTrackId))) {
            return res.status(400).json({
                success: false,
                message: 'trackId parameter is required (iTunes track ID)',
            });
        }

        // Fetch directly from iTunes
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

// @desc    Track song play (API-only, no database tracking)
// @route   POST /api/songs/:id/play
// @access  Public
// @query   trackId - iTunes track ID (can use :id param or query)
// @query   country - Country code (optional, default: 'us')
const playSong = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackId, country = 'us' } = req.query;

        // Use trackId from query or id from params
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

// @desc    Create order for a song (API-only, no database storage)
// @route   POST /api/songs/order
// @access  Public
// @body    userId - User ID (optional in API-only mode)
// @body    songId - Song ID or iTunes trackId
// @body    trackId - iTunes track ID (required)
// @body    country - Country code (optional, default: 'us')
const orderSong = async (req, res) => {
    try {
        const { userId, songId, trackId, country = 'us' } = req.body;

        // Use trackId from body or songId
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

