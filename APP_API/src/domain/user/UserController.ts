import { Request, Response } from 'express';
import UserService from './UserService';

class UserController {

  userService:UserService;

  constructor()
  {

    this.userService = new UserService()
  }

  async create(req: Request, res: Response) {
    try {
      const reqData = req.body
      const service = new UserService()
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
      const service = new UserService()
      const result = await service.deleteSysUserByUserId(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const service = new UserService()
      const attributes = [ "name", "email", "user_id", "status"]
      const result = await service.getUserById(id,attributes);
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

      const service = new UserService()
      const result = await service.update(Number(id), { ...reqData});
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const reqData = req.body
      const { password } = reqData;

      const service = new UserService()
      const result = await service.updatePassword(Number(id), password);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async updateProfile(req: Request | any, res: Response) {
    try {
      const params = req.params;
      const { id } = params
      const profile_picture = req.files.profile_picture
      ? req.files.profile_picture[0].location
      : null;
      console.log("profile_picture", profile_picture)
      const reqData = req.body

      const service = new UserService()
      const result = await service.update(id, { ...reqData, profile_picture: profile_picture});
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async paginate(req: Request, res: Response) {
    try {
      const { page, per_page, filter } = req.query;
      const service = new UserService()
      const result = await service.paginate(+page || 1, +per_page || 25, filter);
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async addCredits(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { credits, note } = req.body;
      
      if (!credits || credits <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Credits must be a positive number' 
        });
      }

      const service = new UserService();
      const result = await service.addCredits(Number(id), credits, note);
      
      return res.status(200).json({
        success: true,
        message: `Successfully added ${credits} credits to user`,
        data: result
      });

    } catch (error: any) {
      console.error('Error adding credits:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to add credits' 
      });
    }
  }


}
export default UserController;
