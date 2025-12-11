import express from 'express';
import { getAllCoaches, getCoachById, createCoach, updateCoach, deleteCoach } from '../controllers/coachController.js';

const router = express.Router();

router.get('/', getAllCoaches);
router.get('/:id', getCoachById);
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

export default router;