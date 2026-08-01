import {Transaction} from "../models/transaction.model.js"
import {Ledger} from "../models/ledger.model.js"
import { Account } from "../models/account.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
  sendTransactionEmail,
  sendTransactionFailed
} from "../services/email.services.js";
import mongoose from "mongoose"

//controller to create transaction
const createTransaction = asyncHandler(async(req,res)=>{

    const {fromAccount,toAccount,amount,idempotencyKey}=req.body;

 if(!fromAccount||!toAccount||!amount||!idempotencyKey){
    throw new ApiError(400,"fromAccount,toAccount,amount,idempotencyKey are required")
 }

 // Check idempotency — if transaction already exists, return its current state
 const isTransactionAlreadyExists = await Transaction.findOne({idempotencyKey:idempotencyKey})

 if(isTransactionAlreadyExists){
   if(isTransactionAlreadyExists.status==="COMPLETED"){
     return res.status(200).json(new ApiResponse(200,isTransactionAlreadyExists,"transaction already completed"));
   }
   if(isTransactionAlreadyExists.status==="PENDING"){
      return res.status(200).json(new ApiResponse(200,isTransactionAlreadyExists,"transaction is processing"));
   }
   if(isTransactionAlreadyExists.status==="FAILED"){
      return res.status(500).json(new ApiResponse(500,isTransactionAlreadyExists,"transaction processing Failed"));
   }
   if(isTransactionAlreadyExists.status==="REVERSED"){
      return res.status(500).json(new ApiResponse(500,isTransactionAlreadyExists,"transaction was reversed. Retry!"));
   }
 }

 const fromUserAccount = await Account.findOne({ _id:fromAccount })
 const toUserAccount = await Account.findOne({ _id:toAccount })

  if(!fromUserAccount || !toUserAccount){
    throw new ApiError(400,"Invalid from or to Account")
  }

  if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(400).json(new ApiResponse(400,{},"both from and to account must be active to process transaction"));
  }

 const balance = await fromUserAccount.getBalance()
 if(balance < amount){
   throw new ApiError(400,`Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}.`)
 }

 // Create transaction (PENDING)
 const session = await mongoose.startSession()
 session.startTransaction()

 try {
   const transaction = await Transaction.create([{
     fromAccount,
     toAccount,
     amount,
     idempotencyKey,
     status: "PENDING"
   }],{session})

   // Create DEBIT ledger entry (money going out of fromAccount)
   await Ledger.create([{
     account: fromAccount,
     amount,
     transaction: transaction[0]._id,
     type: "DEBIT"
   }],{session})

   // Create CREDIT ledger entry (money coming into toAccount)
   await Ledger.create([{
     account: toAccount,
     amount,
     transaction: transaction[0]._id,
     type: "CREDIT"
   }],{session})

   // Mark transaction as COMPLETED
   await Transaction.findByIdAndUpdate(
     transaction[0]._id,
     {status: "COMPLETED"},
     {session, new: true}
   )

   // Commit MongoDB session
   await session.commitTransaction()
   session.endSession()

   // Send email notification (non-blocking)
   try {
     await sendTransactionEmail(
       req.user.email,
       req.user.name,
       amount,
       toAccount
     )
   } catch(emailErr) {
     console.error("Email notification failed:", emailErr)
   }

   return res.status(201).json(new ApiResponse(201, transaction[0], "Transaction completed successfully"))

 } catch(error) {
   await session.abortTransaction()
   session.endSession()

   // Mark transaction as FAILED if it was created
   try {
     await Transaction.findOneAndUpdate(
       {idempotencyKey},
       {status: "FAILED"}
     )
   } catch(e) { /* ignore */ }

   // Send failure email (non-blocking)
   try {
     await sendTransactionFailed(
       req.user.email,
       req.user.name,
       amount,
       toAccount
     )
   } catch(emailErr) {
     console.error("Email notification failed:", emailErr)
   }

   throw new ApiError(500, `Transaction failed: ${error.message}`)
 }
})

// Get transactions for the current user's accounts
const getTransactions = asyncHandler(async(req,res)=>{
  const user = req.user;
  // Find all accounts belonging to the user
  const accounts = await Account.find({user: user._id})
  const accountIds = accounts.map(a => a._id)

  const transactions = await Transaction.find({
    $or:[
      {fromAccount: {$in: accountIds}},
      {toAccount: {$in: accountIds}}
    ]
  }).sort({createdAt:-1}).limit(50)

  return res.status(200).json(new ApiResponse(200, transactions, "Transactions fetched successfully"))
})

export {createTransaction, getTransactions}