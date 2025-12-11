import PricingRule from '../models/PricingRule.js';

export const getAllPricingRules = async (req, res) => {
    try {
        const rules = await PricingRule.find().sort({ priority: 1 });
        res.json({ success: true, data: rules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPricingRuleById = async (req, res) => {
    try {
        const rule = await PricingRule.findById(req.params.id);
        if (!rule) {
            return res.status(404).json({ success: false, message: 'Pricing rule not found' });
        }
        res.json({ success: true, data: rule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPricingRule = async (req, res) => {
    try {
        const rule = await PricingRule.create(req.body);
        res.status(201).json({ success: true, data: rule });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePricingRule = async (req, res) => {
    try {
        const rule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!rule) {
            return res.status(404).json({ success: false, message: 'Pricing rule not found' });
        }
        res.json({ success: true, data: rule });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePricingRule = async (req, res) => {
    try {
        const rule = await PricingRule.findByIdAndDelete(req.params.id);
        if (!rule) {
            return res.status(404).json({ success: false, message: 'Pricing rule not found' });
        }
        res.json({ success: true, message: 'Pricing rule deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};