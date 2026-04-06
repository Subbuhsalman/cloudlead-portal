import AuthenticationUtils from '../domain/authentication/AuthenticationUtils';
import { prisma } from './dbConnection';

export async function verifyJWT_MW(req, res, next) {
  let accessToken;

  // ✅ 1️⃣ Check Authorization header
  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    accessToken = req.headers.authorization.split(' ')[1];
  }
  // ✅ 2️⃣ If not in header, check cookies
  else if (req.cookies && req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  // ✅ 3️⃣ If no token found at all
  if (!accessToken) {
    console.log("No token in header or cookies!");
    req.user = undefined;
    return res.status(401).json({ success: false, message: 'Unauthorized user! Token missing.' });
  }

  try {
    console.log("Here")
    const decode: any = await AuthenticationUtils.verifyJWTTokenPromise(accessToken);

    const userId = decode.userId;

    if (decode.userType === "admin") {
      const admin = await prisma.adminUser.findFirst({ where: { admin_user_id: Number(userId) } });
      if (!admin) {
        req.admin = undefined;
        return res.status(401).json({ success: false, message: 'Admin Unauthorized user!' });
      } else {
        req.admin = admin;
        return next();
      }
    } else {
      const user = await prisma.user.findFirst({ where: { user_id: Number(userId) } });
      if (!user) {
        req.user = undefined;
        return res.status(401).json({ success: false, message: 'User Unauthorized user!' });
      } else {
        req.user = user;
        return next();
      }
    }
  } catch (err) {
    console.log("err", err.message)
    if (err.message === "jwt expired") {
      return res.status(401).json({ message: 'Token expired.' });
    }
    else {
      return res.status(400).json({ message: err.message });
    }

  }
}
