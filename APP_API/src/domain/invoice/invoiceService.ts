// services/invoiceService.ts
import Stripe from 'stripe';
import { prisma } from '../../config/dbConnection';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

class InvoiceService {
  // Get all invoices for a user
  static async getUserInvoices(userId: number, limit = 10) {
    try {
      // Get user's Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        select: { user_stripe_account_id: true }
      });

      if (!user?.user_stripe_account_id) {
        throw new Error('No Stripe customer found for this user');
      }

      // Fetch invoices from Stripe
      const invoices = await stripe.invoices.list({
        customer: user.user_stripe_account_id,
        limit: limit,
        expand: ['data.subscription', 'data.payment_intent']
      });

      return {
        success: true,
        data: invoices.data.map(invoice => ({
          id: invoice.id,
          number: invoice.number,
          amount_paid: invoice.amount_paid / 100, // Convert from cents
          amount_due: invoice.amount_due / 100,
          currency: invoice.currency.toUpperCase(),
          status: invoice.status,
          paid: invoice.paid,
          created: new Date(invoice.created * 1000),
          due_date: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
          period_start: new Date(invoice.period_start * 1000),
          period_end: new Date(invoice.period_end * 1000),
          subscription_id: invoice.subscription,
          description: invoice.description || `Invoice for ${invoice.number}`
        }))
      };
    } catch (error) {
      console.error('Error fetching user invoices:', error);
      throw error;
    }
  }

  // Get specific invoice details
  static async getInvoiceById(userId: number, invoiceId: string) {
    try {
      // Verify user owns this invoice
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        select: { user_stripe_account_id: true }
      });

      if (!user?.user_stripe_account_id) {
        throw new Error('No Stripe customer found for this user');
      }

      // Get invoice from Stripe
      const invoice:any = await stripe.invoices.retrieve(invoiceId, {
        expand: ['subscription', 'payment_intent', 'lines.data.price.product']
      });

      // Verify the invoice belongs to this customer
      if (invoice.customer !== user.user_stripe_account_id) {
        throw new Error('Invoice does not belong to this user');
      }

      return {
        success: true,
        data: {
          id: invoice.id,
          number: invoice.number,
          amount_paid: invoice.amount_paid / 100,
          amount_due: invoice.amount_due / 100,
          subtotal: invoice.subtotal / 100,
          tax: invoice.tax ? invoice.tax / 100 : 0,
          total: invoice.total / 100,
          currency: invoice.currency.toUpperCase(),
          status: invoice.status,
          paid: invoice.paid,
          created: new Date(invoice.created * 1000),
          due_date: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
          period_start: new Date(invoice.period_start * 1000),
          period_end: new Date(invoice.period_end * 1000),
          customer_email: invoice.customer_email,
          customer_name: invoice.customer_name,
          billing_reason: invoice.billing_reason,
          lines: invoice.lines.data.map((line:any) => ({
            id: line.id,
            description: line.description,
            amount: line.amount / 100,
            quantity: line.quantity,
            period_start: new Date(line.period.start * 1000),
            period_end: new Date(line.period.end * 1000),
            product_name: line.price?.product?.name || 'Unknown Product'
          })),
          payment_intent: invoice.payment_intent ? {
            id: invoice.payment_intent.id,
            status: invoice.payment_intent.status,
            created: new Date(invoice.payment_intent.created * 1000)
          } : null
        }
      };
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      throw error;
    }
  }

  // Download invoice PDF
  static async downloadInvoicePDF(userId: number, invoiceId: string) {
    try {
      // Get invoice details first to verify ownership
      const invoiceResult = await this.getInvoiceById(userId, invoiceId);
      
      if (!invoiceResult.success || !invoiceResult.data.invoice_pdf) {
        throw new Error('Invoice PDF not available');
      }

      // Return the PDF URL - Stripe handles the actual PDF generation
      return {
        success: true,
        data: {
          pdf_url: invoiceResult.data.invoice_pdf,
          hosted_url: invoiceResult.data.hosted_invoice_url,
          invoice_number: invoiceResult.data.number
        }
      };
    } catch (error) {
      console.error('Error getting invoice PDF:', error);
      throw error;
    }
  }

  // Get current period invoice
  static async getCurrentPeriodInvoice(userId: number) {
    try {
      // Get user's active subscription
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          user_id: userId,
          status: 'active',
          current_period_end: { gt: new Date() }
        },
        orderBy: { created_at: 'desc' }
      });

      if (!subscription?.stripe_subscription_id) {
        throw new Error('No active subscription found');
      }

      // Get the latest invoice for this subscription
      const invoices = await stripe.invoices.list({
        subscription: subscription.stripe_subscription_id,
        limit: 1,
        expand: ['data.subscription', 'data.payment_intent']
      });

      if (invoices.data.length === 0) {
        throw new Error('No invoices found for current subscription');
      }

      const invoice = invoices.data[0];

      return {
        success: true,
        data: {
          id: invoice.id,
          number: invoice.number,
          amount_paid: invoice.amount_paid / 100,
          currency: invoice.currency.toUpperCase(),
          status: invoice.status,
          paid: invoice.paid,
          created: new Date(invoice.created * 1000),
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
          period_start: new Date(invoice.period_start * 1000),
          period_end: new Date(invoice.period_end * 1000)
        }
      };
    } catch (error) {
      console.error('Error fetching current period invoice:', error);
      throw error;
    }
  }

  // Send invoice via email (Stripe handles the sending)
  static async sendInvoiceEmail(userId: number, invoiceId: string) {
    try {
      // Verify ownership first
      await this.getInvoiceById(userId, invoiceId);

      // Send invoice via Stripe
      const invoice = await stripe.invoices.sendInvoice(invoiceId);

      return {
        success: true,
        data: {
          id: invoice.id,
          status: invoice.status,
          sent: true,
          message: 'Invoice sent successfully'
        }
      };
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  }
}

export default InvoiceService;