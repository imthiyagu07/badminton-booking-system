import PricingRule from '../models/PricingRule.js';

export const calculatePrice = async (bookingDetails) => {
    const { court, date, startTime, endTime, duration, equipment = [], coach = null } = bookingDetails;

    let courtPrice = court.basePrice * duration;
    let equipmentPrice = 0;
    let coachPrice = 0;
    const appliedRules = [];

    if (equipment.length > 0) {
        equipmentPrice = equipment.reduce((total, item) => {
            return total + (item.equipmentData.pricePerUnit * item.quantity * duration);
        }, 0);
    }

    if (coach) {
        coachPrice = coach.pricePerHour * duration;
    }

    let subtotal = courtPrice;

    const pricingRules = await PricingRule.find({ isActive: true }).sort({ priority: 1 });

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();

    for (const rule of pricingRules) {
        let ruleApplies = true;

        if (rule.conditions.timeRange) {
            const { startTime: ruleStart, endTime: ruleEnd } = rule.conditions.timeRange;
            
            if (!(startTime < ruleEnd && endTime > ruleStart)) {
                ruleApplies = false;
            }
        }

        if (rule.conditions.daysOfWeek && rule.conditions.daysOfWeek.length > 0) {
            if (!rule.conditions.daysOfWeek.includes(dayOfWeek)) {
                ruleApplies = false;
            }
        }

        if (rule.conditions.courtTypes && rule.conditions.courtTypes.length > 0) {
            if (!rule.conditions.courtTypes.includes(court.type)) {
                ruleApplies = false;
            }
        }

        if (rule.conditions.dateRange) {
            const { startDate, endDate } = rule.conditions.dateRange;
            if (startDate && bookingDate < new Date(startDate)) {
                ruleApplies = false;
            }
            if (endDate && bookingDate > new Date(endDate)) {
                ruleApplies = false;
            }
        }

        if (ruleApplies) {
            const { type, value, operation } = rule.modifier;

            if (operation === 'multiply') {
                if (type === 'percentage') {
                    const multiplier = 1 + (value / 100);
                    subtotal = subtotal * multiplier;
                }
            } else if (operation === 'add') {
                if (type === 'fixed') {
                    subtotal = subtotal + value;
                } else if (type === 'percentage') {
                    const addition = subtotal * (value / 100);
                    subtotal = subtotal + addition;
                }
            }

            appliedRules.push({
                ruleName: rule.name,
                ruleId: rule._id,
                modifier: value
            });
        }
    }

    const totalPrice = subtotal + equipmentPrice + coachPrice;

    return {
        courtPrice: subtotal,
        equipmentPrice,
        coachPrice,
        appliedRules,
        totalPrice: Math.round(totalPrice * 100) / 100
    };
};