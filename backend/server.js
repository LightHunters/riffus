require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const songRoutes = require('./src/routes/songRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/music_cafe';
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error', err));

// Models
const User = require('./src/models/User');

// Routes
app.use('/api/songs', songRoutes);

app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'music-cafe' });
});

// Demo user route (for example app)
app.get('/users/demo', async (_req, res) => {
    try {
        // let user = await User.findOne();
        // if (!user) {
            // await User.create({
          let user = { 
                name: 'Guest',
                membershipType: 'Gold',
                avatar: 'https://i.pravatar.cc/100?img=5',
            };
        // }
        // res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch demo user' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


