import mongoose,{Schema} from "mongoose";
import {Ledger} from "./ledger.model.js"
const accountSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Account must be associated with user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either active,frozen or closed",
            default:"ACTIVE"
        },
        default:"ACTIVE",
    },
        currency:{
            type:String,
            required:[true,"currency is required for creating an account"],
            default:"NPR"
        }
},
    {timestamps:true})
         
    accountSchema.index({user:1,status:1})
accountSchema.methods.getBalance = async function(){
    const balancedata= await Ledger.aggregate([
        {$match: {account:this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }

            }
        },
        {
            $project:{
                _id:0,
                balance:{$subtract:["$totalCredit","$totalDebit"]}
            }
        }
    ])

    if(balancedata.length===0){
        return 0
    }
    return balancedata[0].balance
}

export const Account=mongoose.model("Account",accountSchema)