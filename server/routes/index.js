import express from 'express';
import { authenticate } from '../middleware/auth.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import consigneeRoutes from './consigneeRoutes.js';
import databaseRoutes from './databaseRoutes.js';
import equipmentInstallationRoutes from './equipmentInstallationRoutes.js';
import itemsRoutes from './itemsRoutes.js';
import loaRoutes from './loaRoutes.js';
// import { auditLog } from '../middleware/auditLog.js';
import poRoutes from './poRoutes.js';
import tenderRoutes from './tenderRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();
// router.use(auditLog);

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/database', databaseRoutes);
router.use('/tenders', authenticate, tenderRoutes);
router.use('/consignees', authenticate, consigneeRoutes);
router.use('/upload', authenticate, uploadRoutes);
router.use('/equipment-installation', authenticate, equipmentInstallationRoutes);
router.use('/admin', authenticate, adminRoutes);
router.use('/items', authenticate, itemsRoutes);
router.use('/loa', loaRoutes);
router.use('/pos', poRoutes);
export default router;