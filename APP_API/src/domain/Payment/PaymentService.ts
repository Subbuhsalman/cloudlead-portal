import { DEFAULT_CURRENCY, STRIPE_ONBOARDING_COMPLETE_URL, STRIPE_ONBOARDING_REFRESH_URL, STRIPE_SECRET_KEY, } from "../../constants/Constants";
import PlatformSettingsRepository from "../PlatformSettings/PlatformSettingsRepository";
import UserService from "../user/UserService";
import UserWalletService from "../UserWallet/UserWalletService";


const stripe = require('stripe')(STRIPE_SECRET_KEY);

class PaymentService {
  private userService: UserService
  private userWalletService: UserWalletService

  constructor() {
    this.userService = new UserService();
    this.userWalletService = new UserWalletService()

  }
  async onbard({ email }: { email: string }) {

    try {
      // Create a Stripe account
      const account = await stripe.accounts.create({
        controller: {
          stripe_dashboard: {
            type: "express",
          },
          fees: {
            payer: "application"
          },
          losses: {
            payments: "application"
          },
        },
        email,
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: STRIPE_ONBOARDING_REFRESH_URL,
        return_url: STRIPE_ONBOARDING_COMPLETE_URL,
        type: 'account_onboarding',
      });
      return { stripeUrl: "", stripeConnectAccountId: account.id }
    } catch (error) {
      console.log("error", error)
      throw error
    }
  }
  async createLoginLink(account:string){
    const loginLink = await stripe.accounts.createLoginLink(account); // Use the correct account ID
    return { url: loginLink.url }
  }
  async createAccountLink(accountId: string) {
    try {
      // Create a Stripe account
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: STRIPE_ONBOARDING_REFRESH_URL + `?connectedAccountId=${accountId}`,
        return_url: STRIPE_ONBOARDING_COMPLETE_URL + `?connectedAccountId=${accountId}`,
        type: 'account_onboarding',
      });
      return accountLink.url
    } catch (error) {
      console.log("error", error)
      throw error
    }

  }
  async deleteConnectedAccount(accountId: string) {
    try {
      // Use the Stripe API to delete the account
      const deletedAccount = await stripe.accounts.del(accountId);
      console.log(`Connected account ${accountId} deleted successfully:`, deletedAccount);
      return deletedAccount;
    } catch (error) {
      console.error('Error deleting connected account:', error);

    }
  }
  async getCustomerPaymentMethods(user: any) {
    try {
      console.log("user.user_stripe_account_id", user.user_stripe_account_id)
      // Fetch all payment methods for the customer
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.user_stripe_account_id,
        type: 'card',  // Specify the type of payment method (card in this case)
      });
      console.log("paymentMethods", paymentMethods)
      // Send the payment methods list to the client
      return { paymentMethods: paymentMethods.data };
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error
    }
  }

  async createOrGetCustomerStripeAccount(email: string, user: any) {
    try {
      // Check if a customer already exists
      const existingCustomer = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      let customer: any;
      let ephemeralKey: any;

      // If customer exists, use the existing customer, otherwise create a new one
      if (existingCustomer.data.length > 0) {
        customer = existingCustomer.data[0];
      } else {
        customer = await stripe.customers.create({ email: email });
      }
      this.userService.update(user.user_id, { user_stripe_account_id: customer.id })
      ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-12-18.acacia' }
      );
      // Create a SetupIntent to securely add a payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Return the setupIntent client secret and customer ID to the client
      return {
        setupIntent: setupIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      };
    } catch (error) {
      console.error("Error creating customer and setup intent:", error);
      throw error;
    }
  }

  async saveCustomerPaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      // Attach payment method to the customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set the payment method as default
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      console.log("first")
      return { message: "Payment method saved successfully!" };
    } catch (error) {
      console.log("error", error)
      throw error;
    }
  }

  async transferFromPlatformToConnectAccount(amount: number, vendorAccountId: string, description: string) {
    const transfer = await stripe.transfers.create({
      amount: amount, // Deduct platform commission (e.g., $5)
      currency: DEFAULT_CURRENCY,
      destination: vendorAccountId, // Vendor Stripe Connect Account ID
      description: description,
    });
    return transfer
  }


  async processCustomerPayment(user: any, amount: number, paymentMethodId: string) {
    try {

      const paymentData = {
        amount: amount, // Amount in the smallest currency unit (e.g., cents for USD)
        currency: DEFAULT_CURRENCY, // Currency
        customer: user.user_stripe_account_id,
        payment_method: paymentMethodId,
        off_session: true, // This is an off-session payment (without customer interaction)
        confirm: true, // Automatically confirm the payment
      }
      // Attach payment method to the customer
      const paymentIntent = await stripe.paymentIntents.create(paymentData);
      if (paymentIntent.status === "succeeded") {
        const getWallet = await this.userWalletService.findByUserId(user.user_id)
        await this.userWalletService.updateByUserId(user.user_id, { amount: (Number(amount) / 100) + getWallet.amount })
      }
      return {
        message: 'Payment processed successfully!',
        paymentIntent: paymentIntent.id,
        ...paymentIntent
      };
    } catch (error) {
      console.log("error", error.message)
      throw error;
    }
  }

  async  deletePaymentMethod(paymentMethodId) {
    try {
      // Detach the payment method from the customer
      const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
      console.log('Payment method deleted successfully:', paymentMethod);
      return paymentMethod;
    } catch (error) {
      console.error('Error deleting payment method:', error.message);
      throw error;
    }
  }

  async  checkAccountVerificationStatus(accountId:string) {
    try {
      const account = await stripe.accounts.retrieve(accountId);
      console.log('Account Details:', account);
  
      // if (account.requirements.currently_due.length === 0) {
      //   console.log('Account is fully verified.');
      //   const vendorService = new VendorService()
      //   await vendorService.findAndUpdate({
      //     where:{
      //       vendor_stripe_connect_account_id: accountId
      //     },
      //     update:{
      //       vendor_stripe_connect_account_status: "VERIFIED"
      //     }
      //   })
      //   return { is_verified: true}
      // } else {
        
      //   console.log('Account is not verified. Requirements:', account.requirements.currently_due);
      //   return { is_verified: false}
      // }
    } catch (error) {
      
      console.error('Error fetching account details:', error);
      return { is_verified: false}
    }
  }
  async  processCardRefund({ paymentIntentId, amount }) {
    try {
      // Convert the amount to the smallest currency unit (e.g., cents for USD)
      const amountInCents = amount * 100;
  
      // Create the refund
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amountInCents, // Optional: Refund full amount if omitted
      });
  
      console.log('Refund processed successfully:', refund);
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error.message);
      throw error;
    }
  }
  
  async processPaymentUserCardAndTransferToConnectAccount({ amountToDeductFromCard,  stripeUserId,  paymentMethod }: { amountToDeductFromCard: number;  stripeUserId: string;  paymentMethod: string }) {
    try {
      // Convert amount to smallest currency unit (e.g., cents for USD)
      const amountInCents = amountToDeductFromCard * 100;
     // const amountToTransferToConnectInCents = amountToTransferToConnect * 100;


      console.log("amountInCents", amountInCents)
      // console.log("amountToTransferToConnectInCents", amountToTransferToConnectInCents)
      // Fetch or create a customer in Stripe

      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: DEFAULT_CURRENCY, // You can make this dynamic if needed
        customer: stripeUserId,
        payment_method: paymentMethod,
        off_session: true,
        confirm: true,
      });
      console.log("paymentIntent", paymentIntent)
      // Transfer the amount to the vendor's Stripe account (if using connected accounts)
      //  When a PaymentIntent succeeds, the funds are initially held in your Stripe account's balance and aren't immediately available for payout or transfer to connected accounts.
      // await stripe.transfers.create({
      //   amount: amountToTransferToConnectInCents,
      //   currency: DEFAULT_CURRENCY,
      //   destination: stripeConnectVendorId, // Assuming vendorId is the Stripe account ID of the vendor
      //   transfer_group: `order_${paymentIntent.id}`,
      // });

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Payment processing failed');
    }
  }

  async applyPlatormCommision(amount: number) {
    const platformSettingsRepository = new PlatformSettingsRepository()
    const CommissionFree = await platformSettingsRepository.findOne({where:{ key: "DEFAULT_ORDER_COMMISSION"}})
    const percentage:number = Number(CommissionFree?.value) || 20;
    const deductedAmount = amount * (percentage / 100); // Calculate the deduction based on the percentage
    const finalAmount = amount - deductedAmount; // Calculate the final amount after deduction

    return { finalAmount, deductedAmount };
  }

}


export default PaymentService;
