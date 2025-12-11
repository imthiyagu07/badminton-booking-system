import Booking from '../models/Booking.js';
import Equipment from '../models/Equipment.js';
import Coach from '../models/Coach.js';

export const checkCourtAvailability = async (courtId, date, startTime, endTime, excludeBookingId = null) => {
    const query = {
        court: courtId,
        date: new Date(date),
        status: { $ne: 'cancelled' }
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const conflictingBookings = await Booking.find(query);

    for (const booking of conflictingBookings) {
        if (timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
            return false;
        }
    }

    return true;
};

export const checkEquipmentAvailability = async (equipmentItems, date, startTime, endTime, excludeBookingId = null) => {
    for (const item of equipmentItems) {
        const equipment = await Equipment.findById(item.item);

        if (!equipment || !equipment.isActive) {
            return { available: false, message: `Equipment not found or inactive` };
        }

        const query = {
            date: new Date(date),
            'equipment.item': item.item,
            status: { $ne: 'cancelled' }
        };

        if (excludeBookingId) {
            query._id = { $ne: excludeBookingId };
        }

        const bookings = await Booking.find(query);

        let bookedQuantity = 0;
        for (const booking of bookings) {
            if (timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
                const bookedItem = booking.equipment.find(e => e.item.toString() === item.item.toString());
                if (bookedItem) {
                    bookedQuantity += bookedItem.quantity;
                }
            }
        }

        const availableQuantity = equipment.totalQuantity - bookedQuantity;

        if (availableQuantity < item.quantity) {
            return {
                available: false,
                message: `Only ${availableQuantity} units of ${equipment.name} available`
            };
        }
    }

    return { available: true };
};

export const checkCoachAvailability = async (coachId, date, startTime, endTime, excludeBookingId = null) => {
    if (!coachId) return { available: true };

    const coach = await Coach.findById(coachId);

    if (!coach || !coach.isActive) {
        return { available: false, message: 'Coach not found or inactive' };
    }

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();

    const availableSlot = coach.availability.find(slot => {
        return slot.dayOfWeek === dayOfWeek &&
            slot.startTime <= startTime &&
            slot.endTime >= endTime;
    });

    if (!availableSlot) {
        return { available: false, message: 'Coach not available at this time' };
    }

    const query = {
        coach: coachId,
        date: bookingDate,
        status: { $ne: 'cancelled' }
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const bookings = await Booking.find(query);

    for (const booking of bookings) {
        if (timeSlotsOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
            return { available: false, message: 'Coach already booked for this time slot' };
        }
    }

    return { available: true };
};

export const checkAllAvailability = async (bookingData, excludeBookingId = null) => {
    const { court, date, startTime, endTime, equipment = [], coach = null } = bookingData;

    const courtAvailable = await checkCourtAvailability(court, date, startTime, endTime, excludeBookingId);
    if (!courtAvailable) {
        return { available: false, message: 'Court not available for the selected time slot' };
    }

    if (equipment.length > 0) {
        const equipmentCheck = await checkEquipmentAvailability(equipment, date, startTime, endTime, excludeBookingId);
        if (!equipmentCheck.available) {
            return equipmentCheck;
        }
    }

    if (coach) {
        const coachCheck = await checkCoachAvailability(coach, date, startTime, endTime, excludeBookingId);
        if (!coachCheck.available) {
            return coachCheck;
        }
    }

    return { available: true };
};

const timeSlotsOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
};

export const calculateDuration = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return (endMinutes - startMinutes) / 60;
};