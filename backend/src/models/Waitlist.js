import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['waiting', 'notified', 'expired', 'converted'],
        default: 'waiting'
    },
    notifiedAt: {
        type: Date,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    position: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

waitlistSchema.index({ court: 1, date: 1, startTime: 1, status: 1 });
waitlistSchema.index({ customerEmail: 1 });
waitlistSchema.index({ status: 1, position: 1 });

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;
