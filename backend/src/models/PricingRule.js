import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0,
        min: 0
    },
    conditions: {
        timeRange: {
            startTime: String,
            endTime: String 
        },
        daysOfWeek: [{
            type: Number,
            min: 0,
            max: 6
        }],
        courtTypes: [{
            type: String,
            enum: ['indoor', 'outdoor']
        }],
        dateRange: {
            startDate: Date,
            endDate: Date
        }
    },
    modifier: {
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        operation: {
            type: String,
            enum: ['add', 'multiply'],
            default: 'add'
        }
    }
}, {
    timestamps: true
});

pricingRuleSchema.index({ isActive: 1, priority: -1 });

const PricingRule = mongoose.model('PricingRule', pricingRuleSchema);

export default PricingRule;
