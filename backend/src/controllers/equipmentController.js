import Equipment from '../models/Equipment.js';

export const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({ isActive: true });
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, message: 'Equipment deactivated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};