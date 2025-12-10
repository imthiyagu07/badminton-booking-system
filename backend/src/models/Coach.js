import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        default: 'Badminton'
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    availability: [{
        dayOfWeek: {
            type: Number,
            required: true,
            min: 0,
            max: 6
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }],
    bio: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Coach = mongoose.model('Coach', coachSchema);

export default Coach;
