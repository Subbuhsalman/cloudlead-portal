import { Express, Request, Response, Router } from 'express';

//[INJECT IMPORTS WITH CONSOLE TOOL]
import responseInterceptor from '../shared/middlewares/response-interceptor';
import { exceptionHandler } from '../shared/middlewares/exception-handling.middleware';
import { pageNotFoundExceptionHandler } from '../shared/middlewares/page-not-found-exception-handler.middleware';
import AutenticationRoutes from '../domain/authentication/AutenticationRoutes';
import AdminUserRoutes from '../domain/adminUser/AdminUserRoutes';
import UserRoutes from '../domain/user/UserRoutes';
import OrdersRoutes from '../domain/Orders/OrdersRoutes';
import { verifyJWT_MW } from '../config/middlewares';
import PricingRouter from '../domain/Pricing/PricingRoutes';
import InvoiceRoutes from '../domain/invoice/InvoiceRoutes';
import FileUploadRoutes from '../domain/FileUpload/FileUploadRoutes';
import AdminFileRoutes from '../domain/FileUpload/AdminFileRoutes';


// Public Routes
const publicRouter = Router();
publicRouter
  .use('/auth', AutenticationRoutes)
  .use('/admin-user', AdminUserRoutes)
  .use('/pricing', PricingRouter) // Pricing routes (public plans + webhook, protected subscription endpoints)

  .get('/', async (req: Request, res: Response) => { res.send('Landing Page'); })
  
//  .use('/user-address', UserAddressRouter);

const protectedRouter = Router();
protectedRouter
   .use(verifyJWT_MW)
  // .use('/dashboard', DashboardRouter)
  .use('/users', UserRoutes)
  // .use('/user-otp', UserOtpRoutes)
  .use('/orders', OrdersRoutes)
  .use('/invoices', InvoiceRoutes)
  .use('/files', FileUploadRoutes)
  .use('/admin/files', AdminFileRoutes)


  // .use('/coupon', CouponRouter)
  // .use('/platform-settings', PlatformSettingsRouter)
  // .use('/tax-rates', TaxRatesRouter)
  // .use('/payment', PaymentRouter)
  // .use('/user-fcm-token', UserFcmTokenRouter)
  // .use('/user-wallet', UserWalletRouter)
  // .use('/transaction', TransactionRouter)


const routerSetup = (app: Express) =>
  app
    .set('trust proxy', true)
    // place interceptor above all routes that you want to intercept
    // interceptor will trigger for every request
    .use(responseInterceptor)


    .use(publicRouter)  // Mount public routes
    .use(protectedRouter)

    // asterisk handles all request paths, but because the order maters,
    // it will ignore route paths that came before
    .use('*', pageNotFoundExceptionHandler)

    // The exception handling middleware is the last one in the pipeline
    .use(exceptionHandler)

export default routerSetup;




























