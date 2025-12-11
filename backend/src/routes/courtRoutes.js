import express from 'express';
import { getAllCourts, getCourtById, createCourt, updateCourt, deleteCourt } from '../controllers/courtController.js';

const router = express.Router();

router.get('/', getAllCourts);
router.get('/:id', getCourtById);
router.post('/', createCourt);
router.put('/:id', updateCourt);
router.delete('/:id', deleteCourt);

export default router;