import {Router} from "express";
import { createTransaction, getTransactions } from "../controllers/transaction.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
const router=Router();

router.route("/").post(verifyJWT,createTransaction)
router.route("/").get(verifyJWT,getTransactions)

export default router;
