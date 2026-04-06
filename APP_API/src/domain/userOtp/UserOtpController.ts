import { Request, Response } from 'express';
import { ZodError } from 'zod';
import UserOtpService from './UserOtpService';

class UserOtpController {



  async create(req: Request, res: Response) {
    try {
      const reqData = req.body
      const service = new UserOtpService()
      const result = await service.create({ ...reqData });
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const service = new UserOtpService()
      const result = await service.delete(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const service = new UserOtpService()
      const result = await service.getById(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }


  async update(req: Request | any, res: Response) {
    try {
      const params = req.params;
      const { id } = params

      const reqData = req.body
      const categoryImageUrl = req.files.cuisine_image
        ? req.files.cuisine_image[0].location
        : null;
      const categoryBannerUrl = req.files.cuisine_banner
        ? req.files.cuisine_banner[0].location
        : null;
      const service = new UserOtpService()
      const result = await service.update(id, { ...reqData, cuisine_image: categoryImageUrl, cuisine_banner: categoryBannerUrl });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
  async paginate(req: Request, res: Response) {
    try {
      const { page, per_page, filter } = req.query;
      const service = new UserOtpService()
      const result = await service.paginate(+page || 1, +per_page || 25, filter);
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
}
export default UserOtpController;
