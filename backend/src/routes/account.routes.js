import {Router} from "express";
import { createAccount, getAccounts } from "../controllers/account.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router();
router.use(verifyJWT);
router.route("/").post(createAccount)
router.route("/").get(getAccounts)

export default router;