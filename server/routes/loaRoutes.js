// server/routes/loaRoutes.js
import express from 'express';
import loaController from '../controllers/loaController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticate);

router.post('/', loaController.create);
router.get('/', loaController.getAll);
router.get('/:id', loaController.getById);
router.put('/:id', loaController.update);
router.delete('/:id', loaController.delete);
router.post('/:id/upload-acceptance',
  upload.single('document'),
  loaController.uploadAcceptanceDocument
);

export default router;