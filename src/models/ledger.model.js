import mongoose,{Schema} from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const ledgerSchema= new Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        immutable:true,
        required:[true,"Amount is required for creating a ledger entry"],

    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required:[true,"Ledger must be associated with a transaction"],
        index:true,
        immutable:true,
    },
    type:{
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either credit or debit"
        },
        required:[true,"Ledger type is required"],
        immutable:true
    }
},{timestamps:true})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);
export const Ledger= mongoose.model("Ledger",ledgerSchema)