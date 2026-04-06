import { Router } from 'express';
import UserController from './UserController';
import {getUserValidator} from './UserMiddleware'
const userController = new UserController()
const router = Router();
import { uploadS3 } from '../../config/configs';

// we should put request validators as well


router.post("/",userController.create);
router.delete("/:id",userController.delete);
router.get("/:id",userController.getById);
router.put("/:id",userController.update);
router.put("/:id/update-password",userController.updatePassword);

router.get("/list/paginated",userController.paginate);
router.post("/add-credits/:id", userController.addCredits);

router.put("/:id/profile", uploadS3.fields([
    { name: "profile_picture", maxCount: 1 },
  ]),  userController.updateProfile);



export default router;
