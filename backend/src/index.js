import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://campusmart-lake.vercel.app',
        'https://campusmart-pczks9kx3-nileshs-projects-225ee072.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'CampusMart API is live' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Self-ping to keep Render awake (every 14 minutes)
    if (process.env.RENDER_EXTERNAL_URL) {
        const interval = 14 * 60 * 1000; // 14 minutes
        setInterval(() => {
            fetch(process.env.RENDER_EXTERNAL_URL)
                .then(() => console.log('Keep-alive ping sent.'))
                .catch(err => console.error('Keep-alive ping failed', err));
        }, interval);
    }
});
