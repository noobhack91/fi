// routes/poRoutes.js
import express from 'express';
import {
    createPO,
    getPOById,
    searchPOs,
    updatePOStatus
} from '../controllers/poController.js';
import { authenticate } from '../middleware/auth.js';
import { validatePO } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// PO routes
router.post('/create', validatePO, createPO);
router.get('/search', searchPOs);
router.get('/:id', getPOById);
router.patch('/:id/status', updatePOStatus);

export default router;