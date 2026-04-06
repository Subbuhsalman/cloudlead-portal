import { Router } from 'express';
import PlatformSettingsController from './PlatformSettingsController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './PlatformSettingsMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new PlatformSettingsController()

const router = Router();
// we should put request validators as well


router.post("/", validateSchema(createSchema), controller.create);
router.put("/:id", controller.update);
router.delete("/:id",controller.delete);

router.get("/:id",controller.getById);
router.get("/key/:key",controller.getByKey);

router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
