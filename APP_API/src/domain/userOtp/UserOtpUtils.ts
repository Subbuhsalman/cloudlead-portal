// import { ENVS } from '@/envKeys';
import JWT, { Algorithm } from 'jsonwebtoken';
import { jwtConfig } from '../../config/configs';

class UserUtils {
  #jwtAlgorithm: Algorithm = 'HS512';

  /**
   * Use to create a JWT access token which user will use to access our portal
   * @param expiresIn: expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
   */
  generateJwtToken({
    user,
    expiresIn = '7 days',
    algorithm = this.#jwtAlgorithm,
    userPermissions,
    userRoles,
    marketingCampaignId

  }: {
    user: any;
    expiresIn?: string | number;
    algorithm?: Algorithm;
    userPermissions: Array<string> | unknown;
    user_id?: number | string;
    userRoles: Array<string> | unknown;
    marketingCampaignId: number | null
  }) {


    const jwtToken = JWT.sign(
      {
        user_id: String(user.user_id),
        userId: String(user.user_id),
        sub: String(user.user_id),
        permissions: userPermissions,
        userRoles: userRoles,
        marketingCanpaignId: marketingCampaignId,

      },
      jwtConfig.secret,
      {
        algorithm,
expiresIn:  "7 days",      }
    );

    return jwtToken;
  }

  verifyJwtToken({ token }: { token: string }) {
    return JWT.verify(token, jwtConfig.secret, {
      complete: true,
    });
  }
}

const userUtils = new UserUtils();

export default userUtils;
