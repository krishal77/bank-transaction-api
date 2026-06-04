import {Account} from "../models/account.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createAccount=asyncHandler(async(req,res)=>{
    const user=req.user;
    const account=await Account.create({
        user:user._id
    })
    return res.status(201).json(new ApiResponse(201,account,"new account created"))
})

export {createAccount}