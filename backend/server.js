import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import courtRoutes from './src/routes/courtRoutes.js';
import equipmentRoutes from './src/routes/equipmentRoutes.js';
import coachRoutes from './src/routes/coachRoutes.js';
import pricingRuleRoutes from './src/routes/pricingRuleRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
    res.json({ message: 'Badminton Court Booking System API'});
});

app.use('/api/courts', courtRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/pricing-rules', pricingRuleRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});