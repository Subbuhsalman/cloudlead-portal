import { Request, Response } from 'express';
import { ZodError } from 'zod';
import PaymentService from './PaymentService';

class PaymentController {



  async createLink(req: Request, res: Response) {
    try {
      const reqData = req.body
      const service = new PaymentService()
      const result = await service.createAccountLink(reqData?.account);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async getCustomerPaymentMethods(req: Request | any, res: Response){
    try {
      const service = new PaymentService()
      console.log("req.user", req.user)
      const result = await service.getCustomerPaymentMethods(req.user);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async createOrGetCustomerStripeAccount(req: Request | any, res: Response){
    try {
      const { email } = req.body;
      console.log("req.user", req.user)

      const service = new PaymentService()
      const result = await service.createOrGetCustomerStripeAccount(email, req.user);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async saveCustomerPaymentMethod(req: Request, res: Response){
    try {
      const { paymentMethodId, customerId  } = req.body;
      const service = new PaymentService()
      const result = await service.saveCustomerPaymentMethod(customerId, paymentMethodId);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async processCustomerPayment(req: Request | any, res: Response){
    try {
      const { amount, paymentMethodId } = req.body;
      const service = new PaymentService()
      const result = await service.processCustomerPayment(req.user, amount, paymentMethodId);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
  async deletePaymentMethod(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const service = new PaymentService()
      const result = await service.deletePaymentMethod(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async checkAccountVerificationStatus(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const service = new PaymentService()
      const result = await service.checkAccountVerificationStatus(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
  

}
export default PaymentController;
