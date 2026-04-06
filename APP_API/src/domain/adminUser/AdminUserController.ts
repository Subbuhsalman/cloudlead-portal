import { Request, Response } from 'express';
import { ZodError } from 'zod';
import AdminUserService from './AdminUserService';
import AuthenticationUtils from '../authentication/AuthenticationUtils';

class AdminUserController {

  adminUserService: AdminUserService;

  constructor() {

    this.adminUserService = new AdminUserService()
  }
  async authenticate(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AdminUserService();
      const response = await autenticationService.authenticate(body.email,  body.password)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }
  async me(req: Request, res: Response) {
    try {
      // Extract tokens from headers and body
      const authHeader = req.headers.authorization;
      const refreshToken:any = req.headers['refresh-token'];

      // Delegate logic to the service
      const autenticationService = new AdminUserService();
      const result = await autenticationService.getUserFromToken(authHeader, refreshToken);
      // Send the response
      return res.status(200).json(result);
    } catch (error) {
      // Error handling
      console.error('Error in me API:', error);
      if (error.status) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const reqData = req.body
      const adminUserService = new AdminUserService()
      const result = await adminUserService.create(reqData);
      return res.status(201).json(result);

    } catch (error) {
      return res.status(500).json({ error });;

    }
  }

  async delete(req: Request, res: Response) {
    try {
      const params = req.params;
      const { admin_user_id } = params;
      const service = new AdminUserService();
      const result = await service.delete(admin_user_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const params = req.params;
      const body = req.body;
      const { admin_user_id } = params;

      const service = new AdminUserService();
      const result = await service.update(Number(admin_user_id), body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const params = req.params;
      const { admin_user_id } = params;
      
      if (!admin_user_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Admin user ID is required' 
        });
      }
      
      const service = new AdminUserService();
      const result = await service.getUserById(Number(admin_user_id), ['name', 'email', 'admin_user_id', 'created_at', 'is_active']);
      
      return res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      console.error('Error fetching admin user by ID:', error);
      
      if (error.message === 'Admin user not found') {
        return res.status(404).json({ 
          success: false, 
          message: 'Admin user not found' 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  async getUserByIdFull(req: Request, res: Response) {
    try {
      const params = req.params;
      const { admin_user_id } = params;
      
      if (!admin_user_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Admin user ID is required' 
        });
      }
      
      const service = new AdminUserService();
      const result = await service.getUserByIdFull(Number(admin_user_id));
      
      return res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      console.error('Error fetching full admin user by ID:', error);
      
      if (error.message === 'Admin user not found') {
        return res.status(404).json({ 
          success: false, 
          message: 'Admin user not found' 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  async paginate(req: Request, res: Response) {
    try {
      const { page, per_page, filter } = req.query;
      const adminUserService = new AdminUserService()
      const result = await adminUserService.paginate(+page || 1, +per_page || 25, filter);
      return res.status(200).json(result);

    } catch (error) {
       return res.status(500).json({ error });;
    }
  }
}
export default AdminUserController;
