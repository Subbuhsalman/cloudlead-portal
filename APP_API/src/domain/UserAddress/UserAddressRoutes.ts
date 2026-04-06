import { Router } from 'express';
import UserAddressController from './UserAddressController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './UserAddressMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new UserAddressController()

const router = Router();
// we should put request validators as well


router.post("/",  controller.create);
router.put("/:id", controller.update);
router.delete("/:id",controller.delete);

router.get("/:id",controller.getById);
router.get("/default/:userId",controller.getDefaultAddressByUserId);
router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
