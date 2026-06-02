import {Router} from "express";
import { userRegisterController,
    loginController
 } from "../controllers/auth.controller.js";
const router=Router();

router.route("/register").post(userRegisterController);
router.route("/login").post(loginController)
export default router;