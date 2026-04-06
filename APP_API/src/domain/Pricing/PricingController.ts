import { Request, Response } from 'express';
import PricingService from './PricingService';
import { ZodError } from 'zod';

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    name: string;
  };
}

class PricingController {
  private pricingService: PricingService;

  constructor() {
    this.pricingService = new PricingService();
  }

  // Get all pricing plans
  async getPlans(req: Request, res: Response) {
    try {
      const result = await this.pricingService.getAllPlans();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

    // Get all pricing plans
  async getFeatures(req: Request, res: Response) {
    try {
      const result = await this.pricingService.getFeatures();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Get user's current subscription and credits
  async getSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const result = await this.pricingService.getUserSubscription(req.user.user_id);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create subscription
  async createSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { planId } = req.body;
      
      if (!planId) {
        return res.status(400).json({
          success: false,
          message: 'Plan ID is required'
        });
      }

      // Create or get Stripe customer
      const { customerId } = await this.pricingService.createOrGetStripeCustomer(
        req.user.email,
        req.user.name,
        req.user.user_id
      );

      // Create subscription
      const result = await this.pricingService.createSubscription(
        customerId,
        parseInt(planId),
        req.user.user_id
      );

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Confirm subscription payment
  async confirmSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Subscription ID is required'
        });
      }

      // Get subscription from Stripe to verify payment
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      if (subscription.status === 'active') {
        // Handle successful payment
        await this.pricingService.handleSuccessfulPayment(subscription, req.user.user_id);
        
        return res.status(200).json({
          success: true,
          message: 'Subscription confirmed successfully'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Subscription payment not completed'
        });
      }
    } catch (error: any) {
      console.error('Error confirming subscription:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Cancel subscription
  async cancelSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const result = await this.pricingService.cancelSubscription(req.user.user_id);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Reactivate subscription
  async reactivateSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const result = await this.pricingService.reactivateSubscription(req.user.user_id);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Use credits for a feature
  async useCredits(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { featureId, creditsToUse, description } = req.body;
      
      if (!featureId || !creditsToUse) {
        return res.status(400).json({
          success: false,
          message: 'Feature ID and credits to use are required'
        });
      }

      if (creditsToUse <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Credits to use must be greater than 0'
        });
      }

      const result = await this.pricingService.useCredits(
        req.user.user_id,
        parseInt(featureId),
        parseInt(creditsToUse),
        description
      );

      return res.status(200).json({
        success: true,
        message: 'Credits used successfully',
        data: result.data
      });
    } catch (error: any) {
      console.error('Error using credits:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Get credit usage history
  async getUsageHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { limit = '50' } = req.query;
      const result = await this.pricingService.getUsageHistory(
        req.user.user_id,
        parseInt(limit as string)
      );
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching usage history:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  // Create billing portal session
  async createBillingPortalSession(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
      }

      const { returnUrl } = req.body;
      const defaultReturnUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
      
      const result = await this.pricingService.createBillingPortalSession(
        req.user.user_id,
        returnUrl || defaultReturnUrl
      );
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error creating billing portal session:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Internal server error' 
      });
    }
  }

  // Handle Stripe webhooks
  async handleWebhook(req: Request, res: Response) {
    try {
      console.log("req.headers", req.headers)
      const sig = req.headers['stripe-signature'];
      console.log("body", req.body)
      if (!sig) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing stripe signature' 
        });
      }

      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!stripeSecret || !stripeWebhookSecret) {
        return res.status(500).json({
          success: false,
          message: 'Stripe webhook is not configured',
        });
      }

      const stripe = require('stripe')(stripeSecret);
      let event;
      const stringBody = req.body;
      try {
        event = await stripe.webhooks.constructEvent(
          stringBody, 
          sig, 
          stripeWebhookSecret
        );
        console.log("event", event)
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ 
          success: false, 
          message: `Webhook Error: ${err.message}` 
        });
      }

      const result = await this.pricingService.handleWebhook(event);
      console.log(`Webhook handled: ${event.type}`, result);
      
      return res.status(200).json({ received: true, result });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Webhook handler failed' 
      });
    }
  }
}

export default PricingController;
