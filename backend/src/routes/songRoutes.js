const express = require('express');
const router = express.Router();

// Choose controller based on environment variable
// Set USE_API_ONLY=true in .env to use API-only mode (no database)
const USE_API_ONLY = process.env.USE_API_ONLY === 'true';

const controllers = USE_API_ONLY
    ? require('../controllers/songController.apiOnly')
    : require('../controllers/songController');

const {
    getSongs,
    getSongById,
    getRecentlyPlayed,
    getRecommended,
    searchSongs,
    playSong,
    orderSong,
} = controllers;

router.route('/').get(getSongs);
router.route('/recent').get(getRecentlyPlayed);
router.route('/recommended').get(getRecommended);
router.route('/search').get(searchSongs);
router.route('/order').post(orderSong);
router.route('/:id').get(getSongById);
router.route('/:id/play').post(playSong);

module.exports = router;
