import { Router } from 'express';
import OrdersController from './OrdersController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './OrdersMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new OrdersController()

const router = Router();
// we should put request validators as well


router.post("/",  controller.create);
router.put("/:id", controller.update);
router.put("/cancel/:id", controller.cancel);

router.delete("/:id",controller.delete);

router.get("/:id",controller.getById);
router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
