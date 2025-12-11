import express from 'express';
import { getAllPricingRules, getPricingRuleById, createPricingRule, updatePricingRule, deletePricingRule } from '../controllers/pricingRuleController.js';

const router = express.Router();

router.get('/', getAllPricingRules);
router.get('/:id', getPricingRuleById);
router.post('/', createPricingRule);
router.put('/:id', updatePricingRule);
router.delete('/:id', deletePricingRule);

export default router;