import {Router} from "express";
import { createAccount } from "../controllers/account.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router();
router.use(verifyJWT);
router.route("/").post(createAccount)

export default router;