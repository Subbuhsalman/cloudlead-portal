import { PrismaClient } from '../../../generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion: '2024-11-20.acacia',
});

class PricingService {
  // Get all active pricing plans with features
  async getAllPlans() {
    try {
      const plans = await prisma.pricingPlan.findMany({
        where: { is_active: true },
        include: {
          planFeatures: {
            include: {
              Feature: true
            }
          }
        },
        orderBy: { price: 'asc' }
      });

      return {
        success: true,
        data: plans.map(plan => ({
          ...plan,
          features: plan.planFeatures.map(pf => ({
            feature_id: pf.Feature.id,
            feature_name: pf.Feature.name,
            description: pf.Feature.description,
            credit_cost: pf.Feature.credit_cost,
            included_usage: pf.included_usage
          }))
        }))
      };
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      throw new Error('Failed to fetch pricing plans');
    }
  }
    async getFeatures() {
    try {
      const plans = await prisma.feature.findMany({
        where: { is_active: true },
      });

      return {
        success: true,
        data: plans
      };
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      throw new Error('Failed to fetch pricing plans');
    }
  }

  // Get plan by ID
  async getPlanById(planId: number) {
    try {
      const plan = await prisma.pricingPlan.findUnique({
        where: { id: planId, is_active: true },
        include: {
          planFeatures: {
            include: {
              Feature: true
            }
          }
        }
      });

      if (!plan) {
        return { success: false, message: 'Plan not found' };
      }

      return {
        success: true,
        data: {
          ...plan,
          features: plan.planFeatures.map(pf => ({
            feature_id: pf.Feature.id,
            feature_name: pf.Feature.name,
            description: pf.Feature.description,
            credit_cost: pf.Feature.credit_cost,
            included_usage: pf.included_usage
          }))
        }
      };
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw new Error('Failed to fetch plan');
    }
  }

  // Get user's active subscription
  async getUserSubscription(userId: number) {
    try {
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          user_id: userId,
          status: 'active',
          current_period_end: { gt: new Date() }
        },
        include: {
          PricingPlan: true
        },
        orderBy: { created_at: 'desc' }
      });

      const credits = await prisma.userCredit.findMany({
        where: {
          user_id: userId,
          expires_at: { gt: new Date() },
          remaining_credits: { gt: 0 }
        },
        include: {
          UserSubscription: {
            include: {
              PricingPlan: true
            }
          }
        },
        orderBy: { expires_at: 'asc' }
      });

      const totalCredits = credits.reduce((sum, credit) => sum + credit.remaining_credits, 0);

      return {
        success: true,
        data: {
          subscription: subscription ? {
            ...subscription,
            plan_name: subscription.PricingPlan.name,
            credits_included: subscription.PricingPlan.credits_included,
            billing_cycle: subscription.PricingPlan.billing_cycle
          } : null,
          credits: credits.map(credit => ({
            ...credit,
            plan_name: credit.UserSubscription.PricingPlan.name
          })),
          totalCredits
        }
      };
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw new Error('Failed to fetch subscription');
    }
  }

  // Create Stripe customer
  async createOrGetStripeCustomer(userEmail: string, userName: string, userId: number) {
    try {
      // Check if user already has a stripe customer ID
      const user = await prisma.user.findUnique({
        where: { user_id: userId }
      });

      if (user?.user_stripe_account_id) {
        return { customerId: user.user_stripe_account_id };
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
        metadata: { user_id: userId.toString() }
      });

      // Update user with stripe customer ID
      await prisma.user.update({
        where: { user_id: userId },
        data: { user_stripe_account_id: customer.id }
      });

      return { customerId: customer.id };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  // Create subscription
  async createSubscription(customerId: string, planId: number, userId: number) {
    try {
      // Get plan details
      const planResult = await this.getPlanById(planId);
      if (!planResult.success) {
        throw new Error('Plan not found');
      }

      const plan = planResult.data;

      // Check if user already has active subscription
      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          user_id: userId,
          status: 'active',
          current_period_end: { gt: new Date() }
        }
      });

      if (existingSubscription) {
        throw new Error('User already has an active subscription');
      }

      // Create Stripe subscription
      const subscription:any = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.stripe_price_id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: { user_id: userId.toString(), plan_id: planId.toString() }
      });

      console.log("subscription", subscription)
      return {
        success: true,
        data: {
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
          subscription,
          plan
        }
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Handle successful payment
  async handleSuccessfulPayment(stripeSubscription: Stripe.Subscription, userId: number) {
    try {
      await prisma.$transaction(async (tx) => {
        // Get plan details
        const plan = await tx.pricingPlan.findFirst({
          where: { stripe_price_id: stripeSubscription.items.data[0].price.id }
        });

        if (!plan) {
          throw new Error('Plan not found');
        }

        // Create subscription record
        const subscription = await tx.userSubscription.create({
          data: {
            user_id: userId,
            plan_id: plan.id,
            stripe_subscription_id: stripeSubscription.id,
            current_period_start: new Date(stripeSubscription.current_period_start * 1000),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            status: 'active'
          }
        });

        // Calculate expiration date
        const expiresAt = new Date(stripeSubscription.current_period_end * 1000);

        // Allocate credits
        await tx.userCredit.create({
          data: {
            user_id: userId,
            subscription_id: subscription.id,
            total_credits: plan.credits_included,
            used_credits: 0,
            remaining_credits: plan.credits_included,
            expires_at: expiresAt
          }
        });

        // Create payment history record
        await tx.paymentHistory.create({
          data: {
            user_id: userId,
            subscription_id: subscription.id,
            amount: plan.price,
            status: 'succeeded'
          }
        });
      });

      return { success: true };
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: number) {
    try {
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          user_id: userId,
          status: 'active'
        }
      });

      if (!subscription || !subscription.stripe_subscription_id) {
        throw new Error('No active subscription found');
      }

      // Cancel at period end in Stripe
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true
      });

      // Update local subscription status
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { status: 'canceled' }
      });

      return { success: true, message: 'Subscription canceled successfully' };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Reactivate subscription
  async reactivateSubscription(userId: number) {
    try {
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          user_id: userId,
          status: 'canceled'
        }
      });

      if (!subscription || !subscription.stripe_subscription_id) {
        throw new Error('No canceled subscription found');
      }

      // Reactivate in Stripe
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: false
      });

      // Update local subscription status
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { status: 'active' }
      });

      return { success: true, message: 'Subscription reactivated successfully' };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Use credits for a feature
  async useCredits(userId: number, featureId: number, creditsToUse: number, description?: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Get available credits (oldest first)
        const availableCredits = await tx.userCredit.findMany({
          where: {
            user_id: userId,
            expires_at: { gt: new Date() },
            remaining_credits: { gt: 0 }
          },
          orderBy: { expires_at: 'asc' }
        });

        if (availableCredits.length === 0) {
          throw new Error('No available credits');
        }

        const totalAvailable = availableCredits.reduce((sum, credit) => sum + credit.remaining_credits, 0);
        if (totalAvailable < creditsToUse) {
          throw new Error('Insufficient credits');
        }

        let remainingToUse = creditsToUse;
        const usageEntries = [];

        for (const credit of availableCredits) {
          if (remainingToUse <= 0) break;

          const creditsFromThis = Math.min(remainingToUse, credit.remaining_credits);

          // Update credit usage
          await tx.userCredit.update({
            where: { id: credit.id },
            data: {
              used_credits: credit.used_credits + creditsFromThis,
              remaining_credits: credit.remaining_credits - creditsFromThis
            }
          });

          // Log usage
          await tx.creditUsageLog.create({
            data: {
              user_id: userId,
              credit_id: credit.id,
              feature_id: featureId,
              credits_used: creditsFromThis,
              description: description || 'Feature usage'
            }
          });

          usageEntries.push({
            credit_id: credit.id,
            credits_used: creditsFromThis
          });

          remainingToUse -= creditsFromThis;
        }

        const remainingCredits = await tx.userCredit.aggregate({
          where: {
            user_id: userId,
            expires_at: { gt: new Date() }
          },
          _sum: { remaining_credits: true }
        });

        return {
          success: true,
          data: {
            usageEntries,
            remainingCredits: remainingCredits._sum.remaining_credits || 0
          }
        };
      });
    } catch (error) {
      console.error('Error using credits:', error);
      throw error;
    }
  }

  // Get usage history
  async getUsageHistory(userId: number, limit = 50) {
    try {
      const history = await prisma.creditUsageLog.findMany({
        where: { user_id: userId },
        include: {
          Feature: true
        },
        orderBy: { created_at: 'desc' },
        take: limit
      });

      return {
        success: true,
        data: history.map(log => ({
          ...log,
          feature_name: log.Feature.name,
          feature_description: log.Feature.description
        }))
      };
    } catch (error) {
      console.error('Error fetching usage history:', error);
      throw new Error('Failed to fetch usage history');
    }
  }

  // Create billing portal session
  async createBillingPortalSession(userId: number, returnUrl: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId }
      });

      if (!user?.user_stripe_account_id) {
        throw new Error('No Stripe customer found');
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.user_stripe_account_id,
        return_url: returnUrl
      });

      return {
        success: true,
        data: { url: session.url }
      };
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }

  // Handle Stripe webhook events
  async handleWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          return await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        
        case 'invoice.payment_failed':
          return await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        
        case 'customer.subscription.updated':
          return await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        
        case 'customer.subscription.deleted':
          return await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
          return { status: 'ignored' };
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const userId = parseInt(subscription.metadata.user_id);
    
    if (!userId) {
      console.error('User ID not found in subscription metadata');
      return { status: 'error', message: 'User ID not found' };
    }

    // Check if this is a renewal
    const existingSubscription = await prisma.userSubscription.findFirst({
      where: {
        user_id: userId,
        stripe_subscription_id: subscription.id
      }
    });
    
    if (existingSubscription) {
      // This is a renewal, allocate new credits
      const plan = await prisma.pricingPlan.findUnique({
        where: { id: existingSubscription.plan_id }
      });

      if (plan) {
        const expiresAt = new Date(subscription.current_period_end * 1000);
        
        await prisma.userCredit.create({
          data: {
            user_id: userId,
            subscription_id: existingSubscription.id,
            total_credits: plan.credits_included,
            used_credits: 0,
            remaining_credits: plan.credits_included,
            expires_at: expiresAt
          }
        });

        // Update subscription period
        await prisma.userSubscription.update({
          where: { id: existingSubscription.id },
          data: {
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            status: 'active'
          }
        });
      }
    } else {
      // This is a new subscription
      await this.handleSuccessfulPayment(subscription, userId);
    }

    return { status: 'success' };
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string;
    
    await prisma.userSubscription.updateMany({
      where: { stripe_subscription_id: subscriptionId },
      data: { status: 'past_due' }
    });
    
    return { status: 'success' };
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    let status: 'active' | 'canceled' | 'past_due' = 'active';
    
    if (subscription.status === 'canceled') status = 'canceled';
    else if (subscription.status === 'past_due') status = 'past_due';
    
    await prisma.userSubscription.updateMany({
      where: { stripe_subscription_id: subscription.id },
      data: {
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        status
      }
    });
    
    return { status: 'success' };
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.userSubscription.updateMany({
      where: { stripe_subscription_id: subscription.id },
      data: { status: 'canceled' }
    });
    
    return { status: 'success' };
  }
}

export default PricingService;
