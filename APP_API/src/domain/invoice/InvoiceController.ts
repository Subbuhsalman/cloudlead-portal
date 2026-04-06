// domain/Pricing/InvoiceController.ts
import { Request, Response } from 'express';
import InvoiceService from './invoiceService';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    name: string;
  };
}

class InvoiceController {
  // Get all invoices for user
  async getUserInvoices(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { limit = '10' } = req.query;
      const result = await InvoiceService.getUserInvoices(
        req.user.user_id, 
        parseInt(limit as string)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching user invoices:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Get specific invoice details
  async getInvoiceDetails(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { invoiceId } = req.params;
      
      if (!invoiceId) {
        return res.status(400).json({
          success: false,
          message: 'Invoice ID is required'
        });
      }

      const result = await InvoiceService.getInvoiceById(req.user.user_id, invoiceId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching invoice details:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Download invoice PDF
  async downloadInvoicePDF(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { invoiceId } = req.params;
      
      if (!invoiceId) {
        return res.status(400).json({
          success: false,
          message: 'Invoice ID is required'
        });
      }

      const result = await InvoiceService.downloadInvoicePDF(req.user.user_id, invoiceId);
      
      if (result.success) {
        // Redirect to Stripe's PDF URL
        return res.redirect(result.data.pdf_url);
      } else {
        return res.status(404).json(result);
      }
    } catch (error: any) {
      console.error('Error downloading invoice PDF:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Get current period invoice
  async getCurrentPeriodInvoice(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const result = await InvoiceService.getCurrentPeriodInvoice(req.user.user_id);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error fetching current period invoice:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Send invoice via email
  async sendInvoiceEmail(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { invoiceId } = req.params;
      
      if (!invoiceId) {
        return res.status(400).json({
          success: false,
          message: 'Invoice ID is required'
        });
      }

      const result = await InvoiceService.sendInvoiceEmail(req.user.user_id, invoiceId);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error sending invoice email:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }
}

export default InvoiceController;