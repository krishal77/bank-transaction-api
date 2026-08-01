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

const getAccounts=asyncHandler(async(req,res)=>{
    const user=req.user;
    const accounts=await Account.find({user:user._id})
    // Attach balance to each account
    const accountsWithBalance = await Promise.all(accounts.map(async(acc)=>{
        const balance = await acc.getBalance()
        return {...acc.toObject(), balance}
    }))
    return res.status(200).json(new ApiResponse(200,accountsWithBalance,"accounts fetched successfully"))
})

export {createAccount, getAccounts}