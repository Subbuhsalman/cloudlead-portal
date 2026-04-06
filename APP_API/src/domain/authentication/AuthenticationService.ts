import e from 'express';
import { smtpConfig, twilioConfig } from '../../config/configs';
import { APP_URL } from '../../constants/Constants';
import SendEmail from '../../services/Mail/EmailSend';
import { SMSService } from '../../services/SMS/SmsService';
import { compareAsync, encryptSync } from '../../Utility/encrypt';
import { generateFourDigitCode } from '../../Utility/utils';
import UserRepository from '../user/UserRepository';
import UserService from '../user/UserService';
import UserOtpService from '../userOtp/UserOtpService';
import AuthenticationUtils from './AuthenticationUtils';


class AuthenticationService {


  async sendRegisterOtp(phone_number: string) {
    try {
      const userService = new UserService();
      const user = await userService.checkIfExists({ user: { email: phone_number }, returnResponseIfExists: true });
      if (user) {
        return { success: false, message: 'User already exist' }
      }
      if (!phone_number) {
        return { success: false, message: 'Phone number required' }
      }
      const code = generateFourDigitCode()
      const smsService = new SMSService('twilio', twilioConfig);
      const otp = await smsService.sendVerification(phone_number, code);
      return { success: true, message: 'OTP Sent', otp }

    } catch (error) {
      return error.message;
    }
  }
  async validateLoginOtp(username: string, code: number, authType: string) {
    try {
      console.log("phone_number", username)
      console.log("code", code)
      const smsService = new SMSService('twilio', twilioConfig);

      const otp = await smsService.validateOtp(username, code);
      console.log("validateLoginOtp", otp)

      if (otp.valid) {
        const userService = new UserService();
        const user: any = await userService.checkIfExists({ user: { email: username }, returnResponseIfExists: true });
        if (user) {
          const refreshToken = await this.generateRefreshToken(String(user.user_id));
          return {
            success: true,
            message: otp,
            user: user,
            accessToken: await this.generateJWT(String(user.user_id)),
            refreshToken: refreshToken
          }
        }
        else {
          return {
            success: false,
            message: "No User Exist",
          }
        }

      }
      else {
        return {
          success: false,
          message: "Invalid Otp"
        }
      }


    } catch (error) {
      console.log("error", error)
      return error.message;
    }
  }
  async validateRegisterOtp(guid: string, code: number) {
    try {

      const otpService = new UserOtpService();
      const otpData = await otpService.find({ where: { guid: guid, otp: code } })
      if (!otpData) {
        return { success: false, message: 'Invalid OTP' }
      }
      if (otpData.is_verified === true) {
        return { success: false, message: 'OTP already verified' }
      }
      if (otpData.expires_at < new Date()) {
        return { success: false, message: 'OTP expired' }
      }
      // Mark OTP as verified
      // await otpService.findOneAndUpdate({
      //   where: { guid: guid, otp: code },
      //   update: { is_verified: true }
      // });
      // Create user account
      const userRepository = new UserService();
      const user: any = await userRepository.getUserById(otpData.user_id, ['user_id', 'email', 'name', 'email_verified', 'status']);
      if (user) {
        userRepository.update(user.user_id, {
          email_verified: 'YES',
          status: 'ACTIVE'
        });
      }

      return { success: true, message: "Successfull Registered" }

    } catch (error) {
      console.log("error", error)
      return error.message;
    }
  }


  async createPassword(body: any) {
    try {
      const { guid, code, password } = body;
      const otpService = new UserOtpService();
      const otpData = await otpService.find({ where: { guid: guid, otp: code } })
      if (!otpData) {
        return { success: false, message: 'Invalid OTP' }
      }
      if (otpData.is_verified === true) {
        return { success: false, message: 'OTP already verified' }
      }
      if (otpData.expires_at < new Date()) {
        return { success: false, message: 'OTP expired' }
      }
      // Mark OTP as verified
      await otpService.findOneAndUpdate({
        where: { guid: guid, otp: code },
        update: { is_verified: true }
      });
      // Create user account
      const userRepository = new UserService();
      const user: any = await userRepository.getUserById(otpData.user_id, ['user_id', 'email', 'name', 'email_verified', 'status']);
      if (user) {
        const encrypted = await encryptSync(password);

        userRepository.update(user.user_id, {
          password: encrypted,
        });
      }

      return { success: true, message: "Password Created" }

    } catch (error) {
      console.log("error", error)
      return error.message;
    }
  }


  async register(body: any) {
    try {
      const userRepository = new UserService();
      const user = await userRepository.checkIfExists({ user: { email: body?.email }, returnResponseIfExists: true });
      if (user) {
        return { success: false, message: 'User already exist' }
      }
      const createData = {
        ...body,
        password: 'null'
        //  password: await encryptSync(body.password)
      }
      await userRepository.create(createData)

      const userData: any = await userRepository.checkIfExists({ user: { email: body?.email }, returnResponseIfExists: true });
      const userOtpService = new UserOtpService();
      const otpResponse = await userOtpService.sendOtp({
        username: body?.email,
        user_id: userData.user_id, // This will be updated after user creation
        subject: 'Register OTP'
      });
      return {
        success: true, message: 'User created!.',
        user: { email: userData.email, name: userData.name, user_id: userData.user_id },
        otp: otpResponse.guid,
        
      }

    } catch (error) {
      return error.message;
    }
  }

  async authenticate(username: string, password: string) {

    const userService = new UserService();
    const user: boolean | any = await userService.checkIfExists({ user: { email: username }, returnResponseIfExists: true });
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
    else if (user.email_verified === 'NO') {
      return {
        success: false,
        message: 'Account not verified',
        user: null,
      };
    }
    const hashedPassword = await compareAsync(password, user.password);
    if (hashedPassword === false) {
      return { success: false, message: "Invalid details" };
    } else if (hashedPassword === true) {
      // generate token
      return {
        success: true,
        user: user,
        accessToken: await this.generateJWT(String(user.user_id)),
        refreshToken: await this.generateRefreshToken(String(user.user_id))
      };
    }
  }


  async resetAccount(username: string) {

    const userService = new UserService();
    const user: any = await userService.checkIfExists({ user: { email: username }, returnResponseIfExists: true });
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
    const code = generateFourDigitCode()
    const resetLink = `${APP_URL}/reset-password?code=${code}&email=${username}`;
    const mailService = new SendEmail(smtpConfig)
    const response = await mailService.sendEmail({
      to: username,
      subject: 'Reset Password',
      html: `<p>Click <a href="${resetLink}">here</a>
  to reset your password.</p>
              <p>If you did not request this, please ignore this email.</p>`,
      text: `Click on this link to reset your password: ${resetLink}`
    });
    console.log("response", response)
    const userOtpService = new UserOtpService();
    userOtpService.create({
      user_id: user.user_id,
      otp: `${code}`,
      is_verified: false,
      expires_at: new Date(Date.now() + 3600000) // 1 hour expiry
    });
    return {
      success: true,
      message: "Reset link sent to your email",
      resetLink
    };

  }

  async resetAccountPassword(email: string, code: string, newPassword: string) {
    const userService = new UserService();
    const otpService = new UserOtpService();

    // 1. Ensure user exists & is active
    const user: any = await userService.checkIfExists({
      user: { email },
      returnResponseIfExists: true
    });
    if (!user) {
      return { success: false, message: "User does not exist" };
    }
    if (user.status === "INACTIVE") {
      return { success: false, message: "User has been disabled" };
    }

    // 2. Find a matching, un‑verified, un‑expired OTP
    const now = new Date();
    const otpRecord: any = await otpService.find({
      where: {
        user_id: user.user_id,
        otp: code,
        is_verified: false,
        expires_at: { gt: now }
      }
    });
    if (!otpRecord) {
      return { success: false, message: "Invalid or expired reset code" };
    }

    // 3. Hash & update the user’s password
    const encrypted = await encryptSync(newPassword);
    await userService.update(
      user.user_id,
      { password: encrypted, email_verified: 'YES' }
    );

    // 4. Mark the OTP as used
    await otpService.findOneAndUpdate(
      { where: { id: otpRecord.id }, update: { is_verified: true } }
    );

    // 5. Done
    return { success: true, message: "Password has been reset successfully" };
  }


  async otpAuthencation(username: string, authType: string) {
    // check if user exists;
    const userService = new UserService();
    console.log("username", username)
    const user: boolean | any = await userService.checkIfExists({ user: { email: username }, returnResponseIfExists: true });
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
    const code = generateFourDigitCode()
    const smsService = new SMSService('twilio', twilioConfig);
    try {
      if (authType === "SMS") {
        await smsService.sendVerification(username, code, "sms");
        return { success: true, message: "OTP Sent" }
      }
      else if (authType === "EMAIL") {
        await smsService.sendVerification(username, code, "email");
        return { success: true, message: "OTP Sent" }
      }
      else if (authType === "VOICE") {
        await smsService.sendVerification(username, code, "call");
        return { success: true, message: "OTP Sent" }
      }
      else {
        return { success: false, message: "No Verication method selected" }
      }
    }
    catch (error) {
      console.log("error", error)
      return { success: false, message: error }
    }
    // const isOtpValid = false;
    // if (isOtpValid === false) {
    //   return { success: false, message: "Invalid Otp" };
    // } else if (isOtpValid === true) {
    //   // generate token
    //   const refreshToken =  await this.generateRefreshToken(String(user.user_id));
    //   return {
    //     success: true,
    //     user: user,
    //     accessToken: await this.generateJWT(String(user.user_id)),
    //     refreshToken: refreshToken
    //   };
    // }
  }

  async generateJWT(userId: string, expiresIn?: string | number) {
    return AuthenticationUtils.generateJwtToken(
      userId,
      "user",
      [],
      []
    );
  }
  async generateRefreshToken(userId: string) {
    return AuthenticationUtils.generateRefreshToken(userId);
  }


  async getUserFromToken(authHeader: string | undefined, refreshToken?: string | undefined) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw { status: 401, message: 'Authorization header missing or invalid' };
    }

    const accessToken = authHeader.split(' ')[1];
    let decodedToken;
    const userService = new UserService();

    try {
      // Verify the accessToken
      decodedToken = AuthenticationUtils.verifyJwtToken(accessToken);
      const userId = decodedToken?.payload.userId;
      const userData = await userService.getUserById(Number(userId), ['name', 'email', 'email_verified', 'user_id', 'status'])
      return userData
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.log("HEEER")
        // Handle expired accessToken
        if (!refreshToken) {
          throw { status: 401, message: 'Access token expired. Refresh token required.' };
        }
        try {
               const refreshTokenDecoded: any = AuthenticationUtils.verifyJwtToken(refreshToken);
        const userId = refreshTokenDecoded?.payload.userId;

        const accessTokenNew = await this.generateJWT(String(userId));
        const refreshTokenNew = await this.generateRefreshToken(String(userId));
        const userData = await userService.getUserById(Number(userId), ['name', 'email', 'email_verified', 'user_id', 'status'])

        return {
          accessToken: accessTokenNew,
          refreshToken: refreshTokenNew,
          ...userData
        };
        } catch (error) {
          if (err.name === 'TokenExpiredError') {
            throw { status: 401, message: 'Refresh token expired.' }
          }
            console.log("error 441", error)
        }
        // Decode the refreshToken and generate new tokens
     
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

  


  async sendGeneralOtp(username: string, authType: string) {
    // check if user exists;
    const userService = new UserService();
    const user: boolean | any = await userService.checkIfExists({ user: { email: username }, returnResponseIfExists: true });
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
    const code = generateFourDigitCode()
    const smsService = new SMSService('twilio', twilioConfig);
    try {
      if (authType === "SMS") {
        await smsService.sendVerification(username, code, "sms");
        return { success: true, message: "OTP Sent" }
      }
      else if (authType === "EMAIL") {
        await smsService.sendVerification(username, code, "email");
        return { success: true, message: "OTP Sent" }
      }
      else if (authType === "VOICE") {
        await smsService.sendVerification(username, code, "call");
        return { success: true, message: "OTP Sent" }
      }
      else {
        return { success: false, message: "No Verication method selected" }
      }
    }
    catch (error) {
      console.log("error", error)
      return { success: false, message: error }
    }
  }
  async validateGeneralOtp(username: string, code) {
    try {
      console.log("validateGeneralOtp username", username)
      console.log("code", code)
      const smsService = new SMSService('twilio', twilioConfig);

      const otp = await smsService.validateOtp(username, code);
      console.log("validateLoginOtp", otp)

      if (otp.valid) {
        const userService = new UserService();
        const user: any = await userService.checkIfExists({ user: { email: username }, returnResponseIfExists: true });
        return {
          success: true,
          message: "Otp Valid",
        }

      }
      else {
        return {
          success: false,
          message: "Invalid Otp"
        }
      }


    } catch (error) {
      console.log("error", error)
      return error.message;
    }
  }
}

export default AuthenticationService;
