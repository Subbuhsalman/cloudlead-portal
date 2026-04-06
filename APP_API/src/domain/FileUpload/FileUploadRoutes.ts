import { Router } from 'express';
import FileUploadController from './FileUploadController';

const fileUploadController = new FileUploadController();
const router = Router();

router
  .post('/upload', fileUploadController.upload)
  .get('/user-files', fileUploadController.getUserFiles)
  .get('/:id', fileUploadController.getFileById)
  .delete('/:id', fileUploadController.deleteFile);

export default router;
