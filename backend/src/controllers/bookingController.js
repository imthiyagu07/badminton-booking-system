import Booking from '../models/Booking.js';
import Court from '../models/Court.js';
import Equipment from '../models/Equipment.js';
import Coach from '../models/Coach.js';
import { checkAllAvailability, calculateDuration } from '../utils/availabilityChecker.js';
import { calculatePrice } from '../utils/pricingEngine.js';

export const createBooking = async (req, res) => {
    try {
        const { courtId, date, startTime, endTime, equipment = [], coachId, customerName, customerEmail, customerPhone, notes } = req.body;

        const duration = calculateDuration(startTime, endTime);

        if (duration <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid time range' });
        }

        const court = await Court.findById(courtId);
        if (!court || !court.isActive) {
            return res.status(404).json({ success: false, message: 'Court not found or inactive' });
        }

        let coach = null;
        if (coachId) {
            coach = await Coach.findById(coachId);
            if (!coach || !coach.isActive) {
                return res.status(404).json({ success: false, message: 'Coach not found or inactive' });
            }
        }

        const equipmentData = [];
        for (const item of equipment) {
            const equip = await Equipment.findById(item.item);
            if (!equip || !equip.isActive) {
                return res.status(404).json({ success: false, message: `Equipment ${item.item} not found or inactive` });
            }
            equipmentData.push({
                item: item.item,
                quantity: item.quantity,
                equipmentData: equip
            });
        }

        const availabilityCheck = await checkAllAvailability({
            court: courtId,
            date,
            startTime,
            endTime,
            equipment: equipmentData.map(e => ({ item: e.item, quantity: e.quantity })),
            coach: coachId
        });

        if (!availabilityCheck.available) {
            return res.status(400).json({ success: false, message: availabilityCheck.message });
        }

        const pricing = await calculatePrice({
            court,
            date,
            startTime,
            endTime,
            duration,
            equipment: equipmentData,
            coach
        });

        const booking = await Booking.create({
            customerName,
            customerEmail,
            customerPhone,
            court: courtId,
            date,
            startTime,
            endTime,
            duration,
            equipment: equipmentData.map(e => ({ item: e.item, quantity: e.quantity })),
            coach: coachId || null,
            pricing,
            notes: notes || ''
        });

        await booking.populate('court equipment.item coach');

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const { date, courtId, status } = req.query;
        const filter = {};

        if (date) filter.date = new Date(date);
        if (courtId) filter.court = courtId;
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('court equipment.item coach')
            .sort({ date: -1, startTime: -1 });

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('court equipment.item coach');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        ).populate('court equipment.item coach');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, data: booking, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAvailableSlots = async (req, res) => {
    try {
        const { courtId, date } = req.query;

        if (!courtId || !date) {
            return res.status(400).json({ success: false, message: 'Court ID and date are required' });
        }

        const bookings = await Booking.find({
            court: courtId,
            date: new Date(date),
            status: { $ne: 'cancelled' }
        }).select('startTime endTime');

        const bookedSlots = bookings.map(b => ({
            startTime: b.startTime,
            endTime: b.endTime
        }));

        res.json({ success: true, data: { bookedSlots } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};