import mongoose,{Schema} from "mongoose";

const transactionModel= new Schema({
    fromAccount:{
        type:mongoose.Types.ObjectId,
        ref:"account",
        required:[true,"transaction must be associated with a from account"],
        index:true
    },
    toAccount:{
        type:mongoose.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a to account"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can be either PENDING,COMPLETED,FAILED or REVERSED",
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
       
},
 idempotencyKey:{
    type:String,
    required:[true,"Idempotency Key is required for creating a transaction"],
    index:true,
    unique:true
 }
},{timestamps:true})

export const Transaction= mongoose.model("Transaction",transactionModel)