


import UserOtpRepository from './UserOtpRepository';
import { generateFiveDigitCode, generateFourDigitCode } from '../../Utility/utils';
import { smtpConfig } from '../../config/configs';
import { APP_URL } from '../../constants/Constants';
import SendEmail from '../../services/Mail/EmailSend';
import { generateOtpTemplate } from '../../mail/Templates/UserOTPTemplate';

interface UserOtpServiceInterface {
  username: string;
  user_id: number;
  subject: string;
}
class UserOtpService {
  private respository: UserOtpRepository

  constructor() {
    this.respository = new UserOtpRepository()
  }
  async create(data: any) {
    const response = await this.respository.create(data);
    return response
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        cuisine_id: Number(id),
      },
    });
  }


  async sendOtp(data: UserOtpServiceInterface) {
    const code = generateFiveDigitCode()
    console.log("code", code)
    const mailService = new SendEmail(smtpConfig)
    const response = await mailService.sendEmail({
      to: data.username,
      subject: data.subject,
      html: generateOtpTemplate(code, data.username),
    });
    const userOtpService = new UserOtpService();
    const otpCreatedResponse = await userOtpService.create({
      user_id: data.user_id,
      otp: `${code}`,
      is_verified: false,
      expires_at: new Date(Date.now() + 3600000) // 1 hour expiry
    });
    return otpCreatedResponse;
  }

  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }

  async find({ where }: { where: any }) {
    return await this.respository.findOne({where});
  }

  async findOneAndUpdate({
    update,
    where,
  }: {
    update: any;
    where: any;
  }) {
    return await this.respository.findOneAndUpdate({ where, update });
  }


  async delete(adminUserId: number | string) {
    const result = await this.respository.delete(adminUserId);
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filter: string | any) {
    return await this.respository.paginate({ page, per_page, filter });
  }



}


export default UserOtpService;
