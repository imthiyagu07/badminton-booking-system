import Coach from '../models/Coach.js';

export const getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({ isActive: true });
        res.json({ success: true, data: coaches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCoachById = async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);
        if (!coach) {
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        res.json({ success: true, data: coach });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCoach = async (req, res) => {
    try {
        const coach = await Coach.create(req.body);
        res.status(201).json({ success: true, data: coach });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coach) {
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        res.json({ success: true, data: coach });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!coach) {
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        res.json({ success: true, message: 'Coach deactivated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};