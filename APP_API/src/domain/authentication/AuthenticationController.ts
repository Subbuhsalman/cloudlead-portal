import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import {
  default as AutenticationService,
  default as AuthenticationService,
} from './AuthenticationService';
import { SMSService } from '../../services/SMS/SmsService';

class AuthenticationController {
  autenticationService: AutenticationService;
  constructor() {

  }
  async otpAuthencation(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.otpAuthencation(body.username, body.authType)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }

  async validateOTP(req: Request, res: Response) {
    try {
      const { phone_number, code, email, authType } = req.body;
      const autenticationService = new AutenticationService();
      let username = phone_number;
      if (authType === "EMAIL") {
        username = email;
      }
      const response = await autenticationService.validateLoginOtp(username, code, authType)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }

  async authenticate(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.authenticate(body.username, body.password)
      if (response.success) {
        return res.status(200).json(response);;
      }
      else {
        return res.status(401).json(response);;
      }

    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }


  async resetAccount(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.resetAccount(body.email)
      console.log("response", response)
      if (response.success) {
        return res.status(200).json(response);;
      }
      else {
        return res.status(401).json(response);;
      }

    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }

  async resetAccountPassword(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.resetAccountPassword(body.email, body.code, body.password)
      console.log("response", response)
      if (response.success) {
        return res.status(200).json(response);;
      }
      else {
        return res.status(401).json(response);;
      }

    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }

  async sendRegisterOtp(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.sendRegisterOtp(body?.phone_number)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });;
    }
  }

  async validateRegisterOtp(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.validateRegisterOtp(body?.guid, body?.code)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });;
    }
  }

  async createPassword(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.createPassword(body)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });;
    }
  }

  async register(req: Request, res: Response) {
    try {

      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.register(body)
      return res.status(201).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(200).json({ error });;
    }
  }

  async me(req: Request, res: Response) {
    try {
      // Extract tokens from headers and body
      console.log("req.headers", req.headers)
      const authHeader = req.headers.authorization;
      const refreshToken: any = req.headers['refresh-token'];
      const autenticationService = new AutenticationService();

      // Delegate logic to the service
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


  async generateJWT(req: Request, res: Response) {
    const requestData = req.body;
    try {
      const autenticationService = new AuthenticationService();
      const token = await autenticationService.generateJWT(
        requestData.userId,
        requestData.expiresIn
      );

      return res.status(200).json({});
    } catch (error) {
      console.log(error.message);
    }
  }



  async sendGeneralOtp(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.sendGeneralOtp(body?.phone_number, "SMS")
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });;
    }
  }

  async ValidateGeneralOtp(req: Request, res: Response) {
    try {
      const body = req.body;
      const autenticationService = new AutenticationService();
      const response = await autenticationService.validateGeneralOtp(body?.phone_number, body?.code)
      return res.status(200).json(response);;
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });;
    }
  }

}

export default AuthenticationController;
