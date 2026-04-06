import { Router } from 'express';
import AdminUserController from './AdminUserController';
const adminUserController = new AdminUserController()

const router = Router();
// we should put request validators as well


router.post("/sigin",adminUserController.authenticate)
.get('/me', adminUserController.me)
.post("/",adminUserController.create)
.delete("/:admin_user_id",adminUserController.delete)
.get("/:admin_user_id",adminUserController.getUserById)
.get("/:admin_user_id/full",adminUserController.getUserByIdFull)
.put("/:admin_user_id",adminUserController.update)
.get("/list/paginated",adminUserController.paginate);

export default router;
