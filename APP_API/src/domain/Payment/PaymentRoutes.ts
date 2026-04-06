import { Router } from 'express';
import PaymentController from './PaymentController';
import { validateSchema } from '../../Utility/middleware';
import { createSchema } from './PaymentMiddleware';
const controller = new PaymentController()

const router = Router();

router.post("/create-vendor-stripe-setup", controller.createLink);

router.get("/vendor/check-verified/:id", controller.checkAccountVerificationStatus);
router.get("/customer/payment-methods", controller.getCustomerPaymentMethods);
router.post("/create-customer", controller.createOrGetCustomerStripeAccount);
router.post("/save-payment-method", controller.saveCustomerPaymentMethod);
router.post("/process-payment", controller.processCustomerPayment);
router.delete("/:id",controller.deletePaymentMethod);

export default router;
