import Court from '../models/Court.js';

export const getAllCourts = async (req, res) => {
    try {
        const courts = await Court.find({ isActive: true });
        res.json({ success: true, data: courts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourtById = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found' });
        }
        res.json({ success: true, data: court });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCourt = async (req, res) => {
    try {
        const court = await Court.create(req.body);
        res.status(201).json({ success: true, data: court });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCourt = async (req, res) => {
    try {
        const court = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found' });
        }
        res.json({ success: true, data: court });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCourt = async (req, res) => {
    try {
        const court = await Court.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found' });
        }
        res.json({ success: true, message: 'Court deactivated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};