


import { compareAsync, encryptSync } from '../../Utility/encrypt';
import AuthenticationUtils from '../authentication/AuthenticationUtils';
import AdminUserRepository from './AdminUserRepository';

class AdminUserService {
  private adminUserRepository: AdminUserRepository

  constructor() {
    this.adminUserRepository = new AdminUserRepository()
  }
  async create(user: any) {
    const password = user.password;

    const userData = {
      email: user.email,
      name: user.name,
      password:  await encryptSync(password),
    };
    return await this.adminUserRepository.create(userData);
  }
  async deleteSysUserByUserId(userId: number | string) {
    return await this.adminUserRepository.deleteByUserId(userId);
  }


  async update(userId: number, body: any) {
    try {
      // If password is provided, encrypt it
      if (body.password) {
        body.password = await encryptSync(body.password);
      }
      
      return await this.adminUserRepository.findOneAndUpdate({
        update: body,
        where: {
          admin_user_id: userId,
        },
      });
    } catch (error) {
      console.error('Error in update service:', error);
      throw new Error(`Failed to update admin user: ${error.message}`);
    }
  }
  generateString(length: number = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async checkIfExists({
    user,
    returnResponseIfExists,
  }: {
    user: any;
    returnResponseIfExists?: boolean;
  }) {
    return await this.adminUserRepository.checkIfExists({ user, returnResponseIfExists });
  }
  async getUserById(userId: number | string, attributes: Array<string>) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const user = await this.adminUserRepository.getUserById(userId, attributes);
      
      if (!user) {
        throw new Error('Admin user not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error in getUserById service:', error);
      throw error;
    }
  }

  async getUserByIdFull(userId: number | string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const user = await this.adminUserRepository.getUserByIdFull(userId);
      
      if (!user) {
        throw new Error('Admin user not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error in getUserByIdFull service:', error);
      throw error;
    }
  }
  async checkIfUserExistsByEmail(email: string) {
    return await this.adminUserRepository.checkIfUserExistsByEmail(email);
  }

  async validateUserPassword(username: string, password: string) {
    return await this.adminUserRepository.validateUserPassword(username, password);
  }
  async delete(adminUserId: number | string) {
    const result = await this.adminUserRepository.deleteByUserId(adminUserId);
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filters: any) {
    return await this.adminUserRepository.paginate({ page, per_page, filters });
  }

  async authenticate(email: string, password: string) {
    // check if user exists;
    const userService = new AdminUserService();
    const user: boolean | any = await userService.checkIfExists({ user: { email: email }, returnResponseIfExists: true });
    if (user === false) {
      return { success: false, message: "User doest exist " }
    } else if (user.status === 'INACTIVE') {
      // prevent deleted or inactive user from logging
      return {
        success: false,
        message: 'User has been disabled',
        user: null,
      };
    }
    const hashedPassword = await compareAsync(password, user.password);
    if (hashedPassword === false) {
      return { success: false, message: "Invalid details" };
    } else if (hashedPassword === true) {
      // generate token
      const refreshToken =  await this.generateRefreshToken(String(user.admin_user_id));
      const accessToken  = await this.generateJWT(String(user.admin_user_id));
      return {
        success: true,
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    }


  }

  async generateJWT(userId: string, expiresIn?: string | number) {
    return AuthenticationUtils.generateJwtToken(
      userId,
      "admin",
      [],
      []
    );
  }
  async generateRefreshToken(userId: string) {
    return AuthenticationUtils.generateRefreshToken(userId);
  }
  async getUserFromToken(authHeader: string | undefined, refreshToken?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw { status: 401, message: 'Authorization header missing or invalid' };
    }

    const accessToken = authHeader.split(' ')[1];
    let decodedToken;

    try {
      // Verify the accessToken
      decodedToken =  AuthenticationUtils.verifyJwtToken(accessToken);
      console.log("decodedToken", decodedToken)
      const userId = decodedToken?.payload.userId;
      const userData = await this.getUserById(Number(userId), ['name','email','is_active'])
      return userData
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle expired accessToken
        if (!refreshToken) {
          throw { status: 401, message: 'Access token expired. Refresh token required.' };
        }

        // Decode the refreshToken and generate new tokens
        const refreshTokenDecoded:any =  AuthenticationUtils.verifyJwtToken(refreshToken);
        const userId = refreshTokenDecoded?.payload.userId;

        const accessTokenNew =  await this.generateJWT(String(userId));
        const refreshTokenNew =  await this.generateRefreshToken(String(userId));
        const userData = await this.getUserById(Number(userId), ['name','email','country_code','phone_number','email_verified','admin_user_id','status'])

        return {
          accessToken: accessTokenNew,
          refreshToken: refreshTokenNew,
          ...userData
        };
      }

      // Other token errors
      throw { status: 401, message: 'Invalid access token.' };
    }

    // If accessToken is valid, return user info
    const { userId, permissions, userRoles } = decodedToken;
    return {
      userId,
      permissions,
      userRoles,
    };
  }

}


export default AdminUserService;
