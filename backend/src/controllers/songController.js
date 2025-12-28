const axios = require('axios');
// DB models removed — this controller is API-only (no DB).
// const Song = require('../models/Song');
// const User = require('../models/User');
// const Order = require('../models/Order');

// @desc    Get all songs (API-only placeholder)
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res) => {
  try {
    // API-only: return empty array or static placeholder
    return res.json([]);
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get recently played songs (API-only placeholder)
// @route   GET /api/songs/recent
// @access  Public
const getRecentlyPlayed = async (req, res) => {
  try {
    // API-only: return empty array or client-side should handle recent list
    return res.json([]);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch recent songs' });
  }
};

// @desc    Get recommended songs (API-only placeholder)
// @route   GET /api/songs/recommended
// @access  Public
const getRecommended = async (req, res) => {
  try {
    // API-only: return empty array or static recommendations if you want
    return res.json([]);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch recommended songs' });
  }
};

// @desc    Search for a song via Spotify (NO DB)
// @route   GET /api/songs/search
// @access  Public
const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }

    // prevent 304 by forcing no-store
    res.set('Cache-Control', 'no-store');

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in env');
      return res.status(500).json({ message: 'Spotify credentials not configured' });
    }

    const authBasic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    let accessToken;
    try {
      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        params.toString(),
        {
          headers: {
            'Authorization': `Basic ${authBasic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }
      );
      accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        console.error('No access_token in token response:', tokenResponse.data);
        return res.status(502).json({ message: 'Failed to obtain Spotify access token' });
      }
    } catch (tokenErr) {
      if (tokenErr.response) {
        console.error('Spotify token error', tokenErr.response.status, tokenErr.response.data);
        return res.status(502).json({ message: 'Spotify token endpoint error', details: tokenErr.response.data });
      } else {
        console.error('Spotify token request failed', tokenErr.message);
        return res.status(502).json({ message: 'Spotify token request failed', details: tokenErr.message });
      }
    }

    // Search Spotify
    const spotifyResponse = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: q,
        type: 'track',
        limit: 25,
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    const items = spotifyResponse.data?.tracks?.items || [];
    const spotifySongs = items.map(item => ({
      spotifyId: item.id,
      title: item.name,
      artist: item.artists?.[0]?.name || 'Unknown Artist',
      album: item.album?.name || '',
      coverImage: item.album?.images?.[0]?.url || '',
      previewUrl: item.preview_url || '',
      // other fields if needed
    }));

    return res.json(spotifySongs);
  } catch (error) {
    if (error.response) {
      console.error('Search error status:', error.response.status, 'data:', error.response.data);
    } else {
      console.error('Search error:', error.message || error);
    }
    return res.status(500).json({ message: 'Failed to search songs' });
  }
};

// @desc    Play a song selected from search (API-only, no DB)
// @route   POST /api/songs/play
// @access  Public
const playSong = async (req, res) => {
  try {
    const {
      spotifyId,
      previewUrl,
      title,
      artist,
      album,
    } = req.body;

    if (!spotifyId && !previewUrl) {
      return res.status(400).json({
        message: 'spotifyId or previewUrl is required',
      });
    }

    // DB: update playCount / lastPlayed (COMMENTED OUT)
    // const song = await Song.findById(req.params.id);
    // if (song) { ... }

    // API-only: acknowledge play
    return res.json({
      status: 'playing',
      song: {
        spotifyId,
        title,
        artist,
        album,
        previewUrl,
      },
      playedAt: new Date(),
    });
  } catch (error) {
    console.error('Play song error:', error);
    return res.status(500).json({ message: 'Failed to play song' });
  }
};

// @desc    Order a song (API-only, NO DB)
// @route   POST /api/songs/order
// @access  Public
const orderSong = async (req, res) => {
  try {
    const { userId, spotifyId, title, artist } = req.body;

    if (!userId || !spotifyId) {
      return res.status(400).json({
        message: 'userId and spotifyId are required',
      });
    }

    // DB: create order (COMMENTED OUT)
    // const order = await Order.create({ user: user._id, song: song._id });

    return res.status(201).json({
      status: 'ordered',
      order: {
        userId,
        spotifyId,
        title,
        artist,
        orderedAt: new Date(),
      },
    });
  } catch (err) {
    console.error('Order error:', err);
    return res.status(500).json({ message: 'Failed to create order' });
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
