import { Router } from 'express';
import UserWalletController from './UserWalletController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './UserWalletMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new UserWalletController()

const router = Router();
// we should put request validators as well


router.post("/", validateSchema(createSchema), controller.create);
router.put("/:id", controller.update);
router.delete("/:id",controller.delete);

router.get("/:id",controller.getById);
router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
