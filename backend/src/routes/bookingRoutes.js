import express from 'express';
import { createBooking, getAllBookings, getBookingById, cancelBooking, getAvailableSlots } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/available-slots', getAvailableSlots);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;