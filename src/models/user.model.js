import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating user"],
        trim:true,
        lowercase:true,
        match:[
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
        ],
        unique:[true,"Email already exist"]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating account"],
    },
    password:{
        type:String,
        required:[true,"password is required for creating an account"],
        minlength:[6,"minimum 6 characters are required"],
        select:false
},
},{timestamps:true})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name,
    },
process.env.JWT_SECRET,{
    expiresIn:"3d"
}
    )
}
export const User= mongoose.model("User",userSchema);