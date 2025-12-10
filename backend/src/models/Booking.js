import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0.5
    },
    equipment: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
        default: null
    },
    pricing: {
        courtPrice: {
            type: Number,
            required: true,
            min: 0
        },
        equipmentPrice: {
            type: Number,
            default: 0,
            min: 0
        },
        coachPrice: {
            type: Number,
            default: 0,
            min: 0
        },
        appliedRules: [{
            ruleName: String,
            ruleId: mongoose.Schema.Types.ObjectId,
            modifier: Number
        }],
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

bookingSchema.index({ court: 1, date: 1, startTime: 1 });
bookingSchema.index({ customerEmail: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.virtual('isPast').get(function () {
    const bookingDateTime = new Date(this.date);
    const [hours, minutes] = this.endTime.split(':');
    bookingDateTime.setHours(parseInt(hours), parseInt(minutes));
    return bookingDateTime < new Date();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
