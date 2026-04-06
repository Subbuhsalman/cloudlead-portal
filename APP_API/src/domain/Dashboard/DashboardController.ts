import { Request, Response } from 'express';
import { ZodError } from 'zod';
import DashboardService from './DashboardService';

class DashboardController {



  async stats(req: Request, res: Response) {
    try {
      const service = new DashboardService()
      const result = await service.stats();
      return res.status(200).json(result);

    } catch (error) {
      return res.status(500).json({ error });;
    }
  }
}
export default DashboardController;
