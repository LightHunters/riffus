const axios = require('axios');

/**
 * iTunes API Service
 * Professional service layer for interacting with Apple iTunes Search API
 * Supports both preview and full track access
 */
class iTunesService {
    constructor() {
        this.baseURL = 'https://itunes.apple.com';
        this.timeout = 10000; // 10 seconds timeout
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Create axios instance with default config
     */
    getClient() {
        return axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Riffus-Music-App/1.0',
            },
        });
    }

    /**
     * Retry mechanism for failed requests
     */
    async retryRequest(requestFn, retries = this.maxRetries) {
        for (let i = 0; i < retries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
            }
        }
    }

    /**
     * Search for tracks in iTunes
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @param {number} options.limit - Maximum results (default: 25, max: 200)
     * @param {string} options.media - Media type (default: 'music')
     * @param {string} options.entity - Entity type (default: 'song')
     * @param {string} options.country - Country code (default: 'us')
     * @returns {Promise<Array>} Array of formatted track objects
     */
    async searchTracks(query, options = {}) {
        const {
            limit = 25,
            media = 'music',
            entity = 'song',
            country = 'us',
        } = options;

        if (!query || query.trim().length === 0) {
            throw new Error('Search query is required');
        }

        const params = {
            term: query.trim(),
            media,
            entity,
            limit: Math.min(limit, 200), // iTunes API max limit is 200
            country,
        };

        try {
            const response = await this.retryRequest(async () => {
                const client = this.getClient();
                return await client.get('/search', { params });
            });

            if (!response.data || !response.data.results) {
                return [];
            }

            return this.formatTracks(response.data.results);
        } catch (error) {
            console.error('iTunes API Error:', error.message);
            throw new Error(`Failed to search iTunes: ${error.message}`);
        }
    }

    /**
     * Get track details by iTunes track ID
     * @param {number} trackId - iTunes track ID
     * @param {string} country - Country code (default: 'us')
     * @returns {Promise<Object|null>} Formatted track object or null
     */
    async getTrackById(trackId, country = 'us') {
        if (!trackId) {
            throw new Error('Track ID is required');
        }

        const params = {
            id: trackId,
            country,
        };

        try {
            const response = await this.retryRequest(async () => {
                const client = this.getClient();
                return await client.get('/lookup', { params });
            });

            if (!response.data || !response.data.results || response.data.results.length === 0) {
                return null;
            }

            return this.formatTrack(response.data.results[0]);
        } catch (error) {
            console.error('iTunes API Error:', error.message);
            throw new Error(`Failed to fetch track: ${error.message}`);
        }
    }

    /**
     * Format iTunes API response to our application format
     * @param {Object} track - Raw iTunes track object
     * @returns {Object} Formatted track object
     */
    formatTrack(track) {
        return {
            title: track.trackName || track.collectionName || 'Unknown',
            artist: track.artistName || 'Unknown Artist',
            album: track.collectionName || 'Unknown Album',
            coverImage: this.getBestCoverImage(track),
            previewUrl: track.previewUrl || null,
            fullTrackUrl: track.trackViewUrl || null, // iTunes store URL for full track
            trackViewUrl: track.trackViewUrl || null,
            trackId: track.trackId || null,
            duration: track.trackTimeMillis || null,
            genre: track.primaryGenreName || null,
            releaseDate: track.releaseDate ? new Date(track.releaseDate) : null,
            source: 'itunes',
        };
    }

    /**
     * Format multiple tracks
     * @param {Array} tracks - Array of raw iTunes track objects
     * @returns {Array} Array of formatted track objects
     */
    formatTracks(tracks) {
        return tracks
            .filter(track => track.kind === 'song') // Only return actual songs
            .map(track => this.formatTrack(track));
    }

    /**
     * Get the best quality cover image available
     * @param {Object} track - iTunes track object
     * @returns {string} Best available cover image URL
     */
    getBestCoverImage(track) {
        // iTunes provides different image sizes: 30x30, 60x60, 100x100, 600x600
        // Prefer larger images, fallback to smaller ones
        return (
            track.artworkUrl100?.replace('100x100', '600x600') ||
            track.artworkUrl100 ||
            track.artworkUrl60?.replace('60x60', '600x600') ||
            track.artworkUrl60 ||
            track.artworkUrl30?.replace('30x30', '600x600') ||
            track.artworkUrl30 ||
            'https://via.placeholder.com/600x600?text=No+Image'
        );
    }

    /**
     * Validate track data before saving
     * @param {Object} track - Track object to validate
     * @returns {boolean} True if valid
     */
    isValidTrack(track) {
        return !!(track && track.title && track.artist && track.coverImage);
    }
}

// Export singleton instance
module.exports = new iTunesService();

