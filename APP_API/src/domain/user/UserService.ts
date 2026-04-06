
import { encryptSync } from '../../Utility/encrypt';
import UserRepository from './UserRepository';

class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()

  }
  async create(user: any) {
    return await this.userRepository.create(user);
  }

  async deleteSysUserByUserId(userId: number | string) {
    try {
      return await this.userRepository.deleteByUserId(userId);

    } catch (error) {
      console.log("error", error)
      throw error
    }
  }


  async checkIfExists({
    user,
    returnResponseIfExists,
  }: {
    user: { email ?: string};
    returnResponseIfExists?: boolean;
  }) {
    return await this.userRepository.checkIfExists({ user, returnResponseIfExists });
  }
  async getUserById(userId: number | string, attributes: Array<string>) {
    return await this.userRepository.getUserById(userId, attributes);
  }
  async checkIfUserExistsByEmail(email: string) {
    return await this.userRepository.checkIfUserExistsByEmail(email);
  }

  async validateUserPassword(username: string, password: string) {
    return await this.userRepository.validateUserPassword(username, password);
  }



  async update(id: number, body: any) {
    return await this.userRepository.findOneAndUpdate({
      update: body,
      where: {
        user_id: Number(id),
      },
    });
  }

  async updatePassword(id: number, password: any) {
    try {
      await this.update(Number(id), { password: await encryptSync(password)})  
      return { success: true, message:"Password updated"}
    } catch (error) {
      return { success: false, message: "Something went wrong"}
    }
    
  }



  async paginate(page: number, per_page: number, filter: string | any) {
    return await this.userRepository.paginate({ page, per_page, filter });
  }

  async addCredits(userId: number, credits: number, note?: string) {
    try {
      // Check if user exists
      const user = await this.userRepository.getUserById(userId, ['user_id', 'name', 'email']);
      if (!user) {
        throw new Error('User not found');
      }

      // Find or create a default subscription for admin-added credits
      let subscriptionId = await this.userRepository.findOrCreateAdminSubscription(userId);

      // Create a new credit entry
      const creditData = {
        user_id: userId,
        subscription_id: subscriptionId,
        total_credits: credits,
        used_credits: 0,
        remaining_credits: credits,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };

      const result = await this.userRepository.addCredits(creditData);
      
      return {
        success: true,
        message: `Added ${credits} credits to ${user.name}`,
        data: result
      };

    } catch (error: any) {
      console.error('Error adding credits:', error);
      throw new Error(`Failed to add credits: ${error.message}`);
    }
  }



}


export default UserService;
