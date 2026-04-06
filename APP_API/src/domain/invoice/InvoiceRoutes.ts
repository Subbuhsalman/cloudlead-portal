// domain/Pricing/InvoiceRoutes.ts
import express from 'express';
import InvoiceController from './InvoiceController';
import { authenticateToken } from '../../shared/middlewares/auth.middleware';

const router = express.Router();
const invoiceController = new InvoiceController();

// All invoice routes require authentication
router.get('/', invoiceController.getUserInvoices.bind(invoiceController));
router.get('/current', invoiceController.getCurrentPeriodInvoice.bind(invoiceController));
router.get('/:invoiceId', invoiceController.getInvoiceDetails.bind(invoiceController));
router.get('/:invoiceId/download', invoiceController.downloadInvoicePDF.bind(invoiceController));
router.post('/:invoiceId/send', invoiceController.sendInvoiceEmail.bind(invoiceController));

export default router;