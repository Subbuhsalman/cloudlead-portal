import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    name: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      select: {
        user_id: true,
        email: true,
        name: true,
        status: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ 
        success: false, 
        message: 'User account is not active' 
      });
    }

    // Add user to request object
    req.user = {
      user_id: user.user_id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};