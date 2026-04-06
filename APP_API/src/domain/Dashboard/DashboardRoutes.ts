import { Router } from 'express';
import DashboardController from './DashboardController';
import { validateSchema } from '../../Utility/middleware';
// import { uploadS3 } from '../../config/configs';
const controller = new DashboardController()

const router = Router();
// we should put request validators as well



router.get("/stats",controller.stats);

export default router;
