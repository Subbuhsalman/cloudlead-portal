import { Router } from 'express';
import AdminFileController from './AdminFileController';

const adminFileController = new AdminFileController();
const router = Router();

router
  .get('/pending', adminFileController.getAllPendingFiles)
  .get('/:id', adminFileController.getFileById)
  .put('/:id/status', adminFileController.updateFileStatus)
  .post('/:id/upload-processed', adminFileController.uploadProcessedFile)
  .get('/:id/download', adminFileController.downloadFile);

export default router;
