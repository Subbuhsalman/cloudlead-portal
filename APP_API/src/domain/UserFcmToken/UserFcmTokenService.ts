


import { firebaseKey } from '../../config/serviceAccountKey';
import UserFcmTokenRepository from './UserFcmTokenRepository';
const admin = require('firebase-admin');



class UserFcmTokenService {
  private respository: UserFcmTokenRepository
  constructor() {
    this.respository = new UserFcmTokenRepository()
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseKey),
      });
    }

  }
  async create(data: any, user: any) {
    try {


      const userToken = await this.respository.findOne({ where: { token: data?.token } })
      if (userToken) {
        return userToken
      }
      return await this.respository.create({ ...data, user_id: user?.user_id || data?.user_id });

    } catch (error) {
      console.log("error", error)
      throw new Error(error.message)
    }
  }

  async update(id: number, body: any) {
    return await this.respository.findOneAndUpdate({
      update: body,
      where: {
        userFcmToken_id: Number(id),
      },
    });
  }

  async sendNotification(userId: number, notification: { title: string, body: string }) {
    try {
      // Find all device tokens for the user
      const userTokens = await this.respository.findMany({
        where: { user_id: Number(userId) },
      });

      if (userTokens.length === 0) {
        console.log('No device tokens found for user.');
        return;
      }

      // Send notifications to each token
      const sendPromises = userTokens.map((token: any) =>
        this.sendPushNotification(token.token, notification)
      );

      await Promise.all(sendPromises);
      console.log('Notifications sent to all tokens.');
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }

  }

  async sendPushNotification(deviceToken: any, notification: { title: string, body: string }) {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      token: deviceToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };
  async getById(id: number | string, attributes?: Array<string>) {
    return await this.respository.getById(id, attributes);
  }


  async delete(user:any, token:string) {
    const result = await this.respository.deleteWhere({
      where:{
        user_id: user?.user_id,
        token: token
      }
    });
    return { data: "Record Deleted", result: result };
  }


  async paginate(page: number, per_page: number, filter: any) {
    return await this.respository.paginate({ page, per_page, filter });
  }

  async getList() {
    return await this.respository.findMany({ where: {} });
  }

}


export default UserFcmTokenService;
