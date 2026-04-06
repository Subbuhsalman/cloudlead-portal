import { Router } from 'express';
import UserFcmTokenController from './UserFcmTokenController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './UserFcmTokenMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new UserFcmTokenController()

const router = Router();
// we should put request validators as well


router.post("/", controller.create);
router.put("/:id", controller.update);
router.post("/delete",controller.delete);

router.get("/:id",controller.getById);
router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
