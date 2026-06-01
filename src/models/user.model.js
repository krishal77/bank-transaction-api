import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
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
    this.password=bcrypt.hash(this.password,10)
    return next();
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}
export const User= mongoose.model("User",userSchema);