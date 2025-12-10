import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Court = mongoose.model('Court', courtSchema);

export default Court;
