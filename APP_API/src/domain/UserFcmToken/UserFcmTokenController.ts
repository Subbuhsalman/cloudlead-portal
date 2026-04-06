import { Request, Response } from 'express';
import { ZodError } from 'zod';
import UserFcmTokenService from './UserFcmTokenService';

class UserFcmTokenController {



  async create(req: Request | any, res: Response) {
    try {
      const reqData = req.body
      const service = new UserFcmTokenService()
      const result = await service.create(reqData, req?.user);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async delete(req: Request | any, res: Response) {
    try {
      const reqData = req.body

      const service = new UserFcmTokenService()
      const result = await service.delete(req?.user, reqData?.token);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const service = new UserFcmTokenService()
      const result = await service.getById(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }


  async update(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const reqData = req.body

      const service = new UserFcmTokenService()
      const result = await service.update(Number(id), reqData);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
  async paginate(req: Request, res: Response) {
    try {
      const { page, per_page, filter } = req.query;
      const service = new UserFcmTokenService()
      const result = await service.paginate(+page || 1, +per_page || 25, filter);
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async getList(req: Request, res: Response) {
    try {
      const service = new UserFcmTokenService()
      const result = await service.getList();
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
}
export default UserFcmTokenController;
