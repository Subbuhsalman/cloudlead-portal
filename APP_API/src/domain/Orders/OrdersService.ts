


import PaymentService from '../Payment/PaymentService';
import { TransactionAction, TransactionIdentifier, TransactionType } from '../Transaction/TransactionConstant';
import TransactionService from '../Transaction/TransactionService';
import UserService from '../user/UserService';
import UserFcmTokenService from '../UserFcmToken/UserFcmTokenService';
import UserWalletService from '../UserWallet/UserWalletService';
import OrdersRepository from './OrdersRepository';
import { OrderStatus, PaymentMethod } from './types';
class OrdersService {
  private respository: OrdersRepository

  constructor() {
    this.respository = new OrdersRepository()
  }

  async create(data: any) {
    // try {

    //   const userService = new UserService();
    //   const userWalletService = new UserWalletService();
    //   const paymentService = new PaymentService();
    //   const notificationService = new UserFcmTokenService();


    //   const { OrderItems, ...rest } = data;
    //   const createData = {
    //     ...rest,
    //     OrderItems: {
    //       create: OrderItems,
    //     },
    //   };

    //   const result =   await prisma.$transaction(async (tx) => {
    //     // Use `tx` instead of `prisma` for all database operations inside the transaction.
    //     const order = await tx.order.create({
    //       data: createData,
    //     });

    //     let subscribedMembership: any = await vendorSubscribedMembershipService.getByVendorId(Number(data?.vendor_id));
    //     const vendor = await vendorService.getById(data?.vendor_id);
    //     const user: any = await userService.getUserById(data?.user_id, ['user_stripe_account_id', 'name', 'user_id']);
    //     const userWallet: any = await userWalletService.findByUserId(data?.user_id);

    //     let vendorEarning = data?.sub_total;
    //     let platformCommission = 0;

    //     if (subscribedMembership.planType === "paid") {
    //       // await tx.vendorSubscribedMembership.update({
    //       //   where: { vendor_subscribed_membership_id: subscribedMembership.data.vendor_subscribed_membership_id },
    //       //   data: { orders_remaining: subscribedMembership.data.orders_remaining - 1 },
    //       // });
    //         if((subscribedMembership.data.orders_remaining - 1) < 6){
    //           await notificationService.sendNotification(vendor.user_id, {
    //             title: 'Membership order limit reach ',
    //             body: 'Please upgrade your subscription',
    //           });
    //         }

    //     } else {
    //       const commissionData = await paymentService.applyPlatormCommision(vendorEarning);
    //       vendorEarning = commissionData.finalAmount;
    //       platformCommission = commissionData.deductedAmount;
    //     }

    //     if (data.paid_with === PaymentMethod.CARD) {
    //       // tx.vendor.update({
    //       //   where:{ vendor_id: vendor.vendor_id },
    //       //   data:{ default_payment_method: PaymentMethod.CARD, default_payment_method_id : data?.payment_method_id }
    //       // })
    //       const paymentIntent = await paymentService.processPaymentUserCardAndTransferToConnectAccount({
    //         amountToDeductFromCard: data.total_amount,
    //         stripeUserId: user.user_stripe_account_id,
    //         paymentMethod: data?.payment_method_id,
    //       });

    //       if (paymentIntent?.status === "succeeded") {
    //         await tx.transaction.create({
    //           data: {
    //             user_id: data.user_id,
    //             order_id: order?.order_id,
    //             amount: data.total_amount,
    //             payment_intent_id: paymentIntent?.id,
    //             transaction_identifier: TransactionIdentifier.CARD_CHARGE,
    //             type: TransactionType.PAYMENT,
    //             action: TransactionAction.DEDUCT,
    //           },
    //         });

    //         await notificationService.sendNotification(vendor.user_id, {
    //           title: 'New order received',
    //           body: 'Please check your dashboard',
    //         });
    //       }
    //       else {
    //         throw new Error('Card declined');
    //       }
    //     } else if (data.paid_with === PaymentMethod.WALLET) {
    //       if (userWallet.amount >= data.total_amount) {
    //         // tx.vendor.update({
    //         //   where:{ vendor_id: vendor.vendor_id },
    //         //   data:{ default_payment_method: PaymentMethod.WALLET, default_payment_method_id : null}
    //         // })
    //         await tx.userWallet.update({
    //           where: { user_id: data.user_id },
    //           data: { amount: userWallet.amount - data.total_amount },
    //         });

    //         await tx.transaction.create({
    //           data: {
    //             user_id: data.user_id,
    //             order_id: order?.order_id,
    //             amount: data.total_amount,
    //             transaction_identifier: TransactionIdentifier.WALLET_TRANSFER,
    //             type: TransactionType.PAYMENT,
    //             action: TransactionAction.DEDUCT,
    //           },
    //         });

    //         await notificationService.sendNotification(vendor.user_id, {
    //           title: 'New order received',
    //           body: 'Please check your dashboard',
    //         });
    //       } else {
    //         throw new Error('Insufficient wallet balance');
    //       }
    //     }
    //     else{
    //       throw new Error('No payment method selected.');

    //     }

        

    //     // await tx.vendorEarnings.create({
    //     //   data: {
    //     //     vendor_id: vendor.vendor_id,
    //     //     order_id: order.order_id,
    //     //     earning: vendorEarning,
    //     //     total_order_amount: data.total_amount,
    //     //     platform_commission: platformCommission,
    //     //     platform_fee: data?.delivery_fee,
    //     //   },
    //     // });
    //     return order;

    //   });

    //   return result;
    // } catch (error) {
    //   console.log("error ", error);
    //   throw new Error(error.message);
    // }
  }
  async cancel(orderId: number) {
    // try {
  
    //   const userWalletService = new UserWalletService();
    //   const paymentService = new PaymentService();

    //   const vendorSubscribedMembershipService = new VendorSubscribedMembershipService();
    //   const transactionService = new TransactionService();
    //   const vendorEarningsService = new VendorEarningsService();
    //   const notificationService = new UserFcmTokenService();
  
    //   const result = await prisma.$transaction(async (tx) => {
    //     // Fetch the order and related data
    //     const order = await tx.order.findUnique({
    //       where: { order_id: orderId },
    //       include: { OrderItems: true },
    //     });
  
    //     if (!order) throw new Error("Order not found");
  
    //     // Fetch vendor and user-related data
    //     const vendorEarnings = await vendorEarningsService.getByOrderId(orderId);
    //     const subscribedMembership:any = await vendorSubscribedMembershipService.getByVendorId(order.vendor_id);
    //     const userWallet = await userWalletService.findByUserId(order.user_id);
  
    //     if (!vendorEarnings) throw new Error("Vendor earnings record not found");
  
    //     // Reverse vendor earnings
    //     // await tx.vendorEarnings.delete({
    //     //   where: { vendor_earning_id: vendorEarnings.vendor_earning_id },
    //     // });
  
    //     // Reverse platform commission and vendor subscription logic
    //     if (subscribedMembership.planType === "paid") {
    //       // await tx.vendorSubscribedMembership.update({
    //       //   where: { vendor_subscribed_membership_id: subscribedMembership.data.vendor_subscribed_membership_id },
    //       //   data: { orders_remaining: subscribedMembership.data.orders_remaining + 1 },
    //       // });
    //     }
  
    //     // Reverse payment logic
    //     if (order.paid_with === PaymentMethod.WALLET) {
    //       // Add the amount back to the user's wallet
    //       await tx.userWallet.update({
    //         where: { user_id: order.user_id },
    //         data: { amount: userWallet.amount + order.total_amount },
    //       });
  
    //       // Add a transaction record for the wallet refund
    //       await tx.transaction.create({
    //         data: {
    //           user_id: order.user_id,
    //           order_id: order.order_id,
    //           amount: order.total_amount,
    //           transaction_identifier: TransactionIdentifier.WALLET_TRANSFER,
    //           type: TransactionType.REFUND,
    //           action: TransactionAction.ADD,
    //         },
    //       });
    //     } else if (order.paid_with === PaymentMethod.CARD) {
    //       // Process card refund
    //       console.log("Refunding -------------->")
    //       const orderTransaction = await  prisma.transaction.findFirst({where:{ order_id:order.order_id }})
    //       const refund = await paymentService.processCardRefund({
    //         paymentIntentId: orderTransaction.payment_intent_id, // Assume paymentIntentId is stored in the order
    //         amount: order.total_amount,
    //       });
    //       console.log("refund", refund)
    //       if (!refund || refund.status !== "succeeded") {
    //         throw new Error("Card refund failed");
    //       }
  
    //       // Add a transaction record for the card refund
    //       await tx.transaction.create({
    //         data: {
    //           user_id: order.user_id,
    //           order_id: order.order_id,
    //           amount: order.total_amount,
    //           transaction_identifier: TransactionIdentifier.CARD_TRANSFER,
    //           type: TransactionType.REFUND,
    //           action: TransactionAction.ADD,
    //         },
    //       });
    //     }
  
    //     // Update order status to cancelled
    //     await tx.order.update({
    //       where: { order_id: orderId },
    //       data: { order_status: "CANCELLED" },
    //     });
  
    //     // Send notification to the vendor and user
    //     await notificationService.sendNotification(order.vendor_id, {
    //       title: "Order Cancelled",
    //       body: "An order has been cancelled. Please check your dashboard.",
    //     });
  
    //     await notificationService.sendNotification(order.user_id, {
    //       title: "Order Cancelled",
    //       body: "Your order has been successfully cancelled.",
    //     });
  
    //     return order;
    //   });
  
    //   // Return the cancelled order details
    //   return {
    //     success: true,
    //     message: "Order cancelled successfully",
    //     data: await this.getById(orderId),
    //   };
    // } catch (error) {
    //   console.log("error", error);
    //   throw new Error(error.message);
    // }
  }
  

  // async create(data: any) {
  //   console.log("data", data);
  //   try {


  //     const userService = new UserService();
  //     const vendorService = new VendorService();
  //     const userWalletService = new UserWalletService();
  //     const vendorSubscribedMembershipService = new VendorSubscribedMembershipService();
  //     const paymentService = new PaymentService();
  //     const notificationService = new UserFcmTokenService();
  //     const transactionService = new TransactionService();
  //     const vendorEarningsService = new VendorEarningsService();


  //     const { OrderItems, ...rest } = data;
  //     const createData = {
  //       ...rest,
  //       OrderItems: {
  //         create: OrderItems,
  //       },
  //     };
  //     const order = await this.respository.create(createData);

  //     let subscribedMembership: any = await vendorSubscribedMembershipService.getByVendorId(Number(data?.vendor_id));
  //     const vendor = await vendorService.getById(data?.vendor_id);
  //     const user: any = await userService.getUserById(data?.user_id, ['user_stripe_account_id', 'name', 'user_id'])
  //     const userWallet: any = await userWalletService.findByUserId(data?.user_id);

  //     let vendorEarning = data?.sub_total;
  //     let platformCommission = 0;
  //     if (subscribedMembership.planType === "paid") {
  //       // 1. Deduct order remaining from current remaining
  //       await vendorSubscribedMembershipService.update(
  //         subscribedMembership.data.vendor_subscribed_membership_id,
  //         { orders_remaining: subscribedMembership.data.orders_remaining - 1 }
  //       );
  //     }
  //     else{
  //       const comissionData = await paymentService.applyPlatormCommision(vendorEarning)
  //       vendorEarning = comissionData.finalAmount;
  //       platformCommission = comissionData.deductedAmount;
  //     }

  //     if (data.paid_with === 'card') {
  //       // 2. Check if payment method is card, deduct and transfer to vendor account
  //       const paymentIntent = await paymentService.processPaymentUserCardAndTransferToConnectAccount({
  //         amountToDeductFromCard: data.total_amount,
  //         amountToTransferToConnect: data.sub_total,
  //         stripeUserId: user.user_stripe_account_id,
  //         stripeConnectVendorId: vendor.vendor_stripe_connect_account_id,
  //         paymentMethod: data?.payment_method_id
  //       });

  //       if (paymentIntent?.status === "succeeded") {
  //         await transactionService.create({
  //           user_id: data.user_id,
  //           order_id: order?.order_id,
  //           amount: data.total_amount,
  //           transaction_identifier: TransactionIdentifier.CARD_CHARGE,
  //           type: TransactionType.PAYMENT,
  //           action: TransactionAction.DEDUCT
  //         });

  //         // Send notification to the vendor
  //         await notificationService.sendNotification(vendor.user_id, { title: 'New order received', "body": "Please check your dashboard" });
  //       }
  //     } else if (data.paid_with === 'wallet') {
  //       // 3. If payment method is wallet, deduct from wallet amount
  //       if (userWallet.amount >= data.total_amount) {
  //         await userWalletService.updateByUserId(data.user_id, { amount: userWallet.amount - data.total_amount });

  //         await transactionService.create({
  //           user_id: data.user_id,
  //           order_id: order?.order_id,
  //           amount: data.total_amount,
  //           transaction_identifier: TransactionIdentifier.WALLET_TRANSFER,
  //           type: TransactionType.PAYMENT,
  //           action: TransactionAction.DEDUCT
  //         });

  //         // Send notification to the vendor
  //         await notificationService.sendNotification(vendor.user_id, { title: 'New order received', "body": "Please check your dashboard" });
  //       } else {
  //         throw new Error('Insufficient wallet balance');
  //       }
  //     }


  //     // Create the order record

  //     await vendorEarningsService.create({
  //       vendor_id: vendor.vendor_id,
  //       order_id:order.order_id,
  //       earning: vendorEarning,
  //       total_order_amount: data.total_amount,
  //       platform_commission: platformCommission,
  //       platform_fee:data?.delivery_fee,

  //     })
  //     return order;
  //   } catch (error) {
  //     console.log("error ", error)
  //     throw new Error(error.message)
  //   }
  // }


  // async create(data: any) {
  //   console.log("data", data)
  //   const vendorMembershipService = new VendorMembershipService();
  //   const vendorService = new VendorService()
  //   const userWalletService = new UserWalletService()
  //   const vendorSubscribedMembershipService = new VendorSubscribedMembershipService();
  //   const paymentService = new PaymentService();

  //   let subscribedMemberShip:any = await vendorSubscribedMembershipService.getByVendorId(Number(data?.vendor_id));
  //   const vendor = await vendorService.getById(data?.vendor_id)
  //   const userWallet = await userWalletService.findByUserId(vendor.user_id);

  //   // if paid do
  //   // 1. deduct order remaining from current remaning
  //   // 2. check if payment method is card deduct and trasnfer to vendor account
  //   // 3. if  payment method is wallet deduct from wallet amount 
  //   // 4. send notification to vendor
  //   // 5. Insert Transaction 
  //         // a.Amount Credit to vendor
  //         // b.User Amount deduct for card or Wallet
  //   if(subscribedMemberShip.planType === "paid"){
  //     // 1. deduct order remaining from current remaning
  //     await vendorSubscribedMembershipService.update(subscribedMemberShip.data.vendor_subscribed_membership_id, { orders_remaining: subscribedMemberShip.data.orders_remaining - 1 })

  //   }
  //   else{

  //   }

  //   const { OrderItems, ...rest } = data;
  //   const createData= {
  //     ...rest,
  //     OrderItems:{
  //       create :OrderItems
  //     }
  //   }
  //   return null
  //   return await this.respository.create(createData);
  // }

  async update(id: number, body: any) {
    await this.respository.findOneAndUpdate({
      update: body,
      where: {
        order_id: Number(id),
      },
    });
    const order = await this.getById(id)
    if(order){
      const notificationService = new UserFcmTokenService();

      if(body?.order_status === OrderStatus.CANCELLED){
        await notificationService.sendNotification(order.user_id, {
          title: "Order Cancelled",
          body: "Your order has been cancelled.",
        });
  
      }
      if(body?.order_status === OrderStatus.IN_PROGRESS){
        await notificationService.sendNotification(order.user_id, {
          title: "Order in progress",
          body: "Your order in progress.",
        });
      }
      if(body?.order_status === OrderStatus.OUT_FOR_DELIVERY){
        await notificationService.sendNotification(order.user_id, {
          title: "Order is out for delivery",
          body: "Your order is out for delivery.",
        });
      }
      if(body?.order_status === OrderStatus.COMPLETED){
        await notificationService.sendNotification(order.user_id, {
          title: "Order is complete",
          body: "Your order is compelete.",
        });
      }
    }
    

    return this.getById(id)
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }


  async delete(adminUserId: number | string) {
    const result = await this.respository.delete(adminUserId);
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filter: any, searchFilters: any) {
    return await this.respository.paginate({ page, per_page, filter, searchFilters });
  }

  async getList() {
    return await this.respository.findMany();
  }

}


export default OrdersService;
