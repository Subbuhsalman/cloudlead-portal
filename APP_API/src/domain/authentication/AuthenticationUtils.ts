
import JWT, { Algorithm, Secret } from 'jsonwebtoken';
import { jwtConfig } from '../../config/configs';

class AuthenticationUtils {
  static jwtAlgorithm: Algorithm = 'HS512';

  /**
   * Use to create a JWT access token which user will use to access our portal
   * @param expiresIn: expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
   */
  static generateJwtToken(
    
      userId: string,
      userType: "admin" | "user",
      userPermissions: Array<string> | unknown | null,
      userRoles:Array<string> | unknown | null,
      
  ) {
    
    const jwtToken = JWT.sign(
      {
        userId: userId,
        user_id:userId,
        userType: userType,
        sub: userId,
        permissions: userPermissions,
        userRoles
      },
      jwtConfig.secret,
      {
        algorithm: this.jwtAlgorithm,
        expiresIn: 3600,
      }
    );

    return jwtToken;
  }

  static verifyJwtToken( token: string) {
    return JWT.verify(token, jwtConfig.secret, {
      complete: true,
    });
  }
  static verifyJWTTokenPromise(token) {
    return new Promise((resolve, reject) => {
      JWT.verify(token, jwtConfig.secret, (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err)
        }
        resolve(decodedToken)
      })
    })
  }
  static generateRefreshToken(
    userId: string,
    expiresIn:  number = 3600
  ) {
    const refreshToken = JWT.sign(
      {
        userId: userId,
        sub: userId,
        type: 'refresh',
      },
      jwtConfig.secret,
      {
        algorithm: this.jwtAlgorithm,
        expiresIn,
      }
    );

    return refreshToken;
  }
  async generateRefreshToken(userId: string) {
    const expiresIn = 60 * 60 * 24 * 7 
    return AuthenticationUtils.generateRefreshToken(userId, expiresIn);
  }
}

export default AuthenticationUtils;
