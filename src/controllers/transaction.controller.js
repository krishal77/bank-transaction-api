import {Transaction} from "../models/transaction.model.js"
import {Ledger} from "../models/ledger.model.js"
import { Account } from "../models/account.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {sendRegistrationEmail,
  sendTransactionEmail,
sendTransactionFailed} from "../services/email.services.js";

const createTransaction = asyncHandler(async(req,res)=>{

    const {fromAccount,toAccount,amount,idempotencyKey}=req.body;

 if(!fromAccount||!toAccount||!amount||!idempotencyKey){
    throw new ApiError(400,"fromAccount,toAccount,amount,idempotencyKey are required")
 }

 const fromUserAccount = await Account.findOne(
    {
        _id:fromAccount
    }
)

  const toUserAccount = await Account.findOne(
    {
        _id:toAccount
    }
)

  if(!fromUserAccount || !toUserAccount){
    throw new ApiError(400,"Invalid from our to Account")
  }


})




export {createTransaction}