
import { Router, Request, Response } from "express";
import AuthenticationController from './AuthenticationController';
import { getAuthenticationValidator,getGenerateTokenValidator, registerSchema} from './AuthenticationMiddleware'
import { validateSchema } from "../../Utility/middleware";
import { verifyJWT_MW } from "../../config/middlewares";
const authenticationController = new AuthenticationController()
const router = Router();

router
.post("/register/account", validateSchema(registerSchema), authenticationController.register)
.post("/verify-verification-code",  authenticationController.validateRegisterOtp)
.post("/create-password",  authenticationController.createPassword)

.post('/authenticate/credential',getAuthenticationValidator, authenticationController.authenticate)
.post('/account/reset',authenticationController.resetAccount)
.post('/account/reset-new-password',authenticationController.resetAccountPassword)


.post('/generate-token/', getGenerateTokenValidator, authenticationController.generateJWT)
.get('/me', authenticationController.me);


export default router;
