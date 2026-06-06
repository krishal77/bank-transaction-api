import {Router} from "express";
import { createTransaction } from "../controllers/transaction.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
const router=Router();

router.route("/").post(verifyJWT,createTransaction)

export default router;
