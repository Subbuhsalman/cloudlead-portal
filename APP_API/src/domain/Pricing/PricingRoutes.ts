import express from 'express';
import PricingController from './PricingController';

const router = express.Router();
const pricingController = new PricingController();

// Import authentication middleware
import { verifyJWT_MW } from '../../config/middlewares';

// Public routes
router.get('/plans', pricingController.getPlans.bind(pricingController));
router.get('/features', pricingController.getFeatures.bind(pricingController));

// Protected routes - require authentication
router.get('/subscription', verifyJWT_MW, pricingController.getSubscription.bind(pricingController));
router.post('/subscribe', verifyJWT_MW, pricingController.createSubscription.bind(pricingController));
router.post('/confirm-subscription', verifyJWT_MW, pricingController.confirmSubscription.bind(pricingController));
router.post('/cancel', verifyJWT_MW, pricingController.cancelSubscription.bind(pricingController));
router.post('/reactivate', verifyJWT_MW, pricingController.reactivateSubscription.bind(pricingController));
router.post('/use-credits', verifyJWT_MW, pricingController.useCredits.bind(pricingController));
router.get('/usage-history', verifyJWT_MW, pricingController.getUsageHistory.bind(pricingController));
router.post('/billing-portal', verifyJWT_MW, pricingController.createBillingPortalSession.bind(pricingController));

// Webhook route - requires raw body, no auth
router.post('/webhook', express.raw({ type: 'application/json' }), pricingController.handleWebhook.bind(pricingController));

export default router;