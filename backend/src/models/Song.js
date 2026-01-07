const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        artist: { type: String, required: true, trim: true },
        album: { type: String, trim: true },
        coverImage: { type: String, required: true },
        category: { type: String, default: 'general' },
        playCount: { type: Number, default: 0 },
        lastPlayed: { type: Date },
        previewUrl: { type: String },
        fullTrackUrl: { type: String }, // iTunes track URL for full playback
        trackViewUrl: { type: String }, // iTunes store URL
        trackId: { type: Number, unique: true, sparse: true }, // iTunes track ID
        duration: { type: Number }, // Track duration in milliseconds
        genre: { type: String },
        releaseDate: { type: Date },
        source: { type: String, default: 'itunes' }, // Track source (itunes, local, etc.)
    },
    { timestamps: true }
);

// Index for faster searches
SongSchema.index({ title: 'text', artist: 'text', album: 'text' });
SongSchema.index({ trackId: 1 });
SongSchema.index({ lastPlayed: -1 });
SongSchema.index({ playCount: -1 });

module.exports = mongoose.model('Song', SongSchema);


