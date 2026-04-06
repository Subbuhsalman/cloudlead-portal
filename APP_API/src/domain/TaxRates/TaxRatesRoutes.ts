import { Router } from 'express';
import TaxRatesController from './TaxRatesController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema, checkTax } from './TaxRatesMiddleware';
// import { uploadS3 } from '../../config/configs';
const controller = new TaxRatesController()

const router = Router();
// we should put request validators as well

router.post("/get-tax", validateSchema(checkTax), controller.getTaxByCountryState);
router.post("/", validateSchema(createSchema), controller.create);
router.put("/:id", controller.update);
router.delete("/:id",controller.delete);

router.get("/:id",controller.getById);
router.get("/list/paginated",controller.paginate);
router.get("/",controller.getList);

export default router;
