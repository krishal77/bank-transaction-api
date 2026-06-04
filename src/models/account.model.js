import mongoose,{Schema} from "mongoose";

const accountSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Account must be associated with user"],
        index:true
    },
    status:{
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either active,frozen or closed"
        },
        currency:{
            type:String,
            required:[true,"currency is required for creating an account"],
            default:"NPR"
        }
    }
},
    {timestamps:true})

export const Account=mongoose.model("Account",accountSchema)