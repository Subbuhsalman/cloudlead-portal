import { Router } from 'express';
import CouponController from './CouponController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './CouponMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new CouponController()

const router = Router();
// we should put request validators as well


router.post("/validate", controller.validateCoupon);
router.post("/", validateSchema(createSchema), controller.create);
router.put("/:id", controller.update);
router.delete("/:id",controller.delete);

router.get("/:id",controller.getById);
router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
