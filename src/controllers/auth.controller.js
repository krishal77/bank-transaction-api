import  {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

const generateAccessToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=await user.generateAccessToken();
        return{accessToken}
    }catch(error){
        throw new ApiError(500,"something went wrong while generating token")
    }
}

const userRegisterController=asyncHandler(async(req,res)=>{
    const {email ,password ,name}=req.body;
    const isExist=await User.findOne({
        email:email,
    })
    if([name,email,password].some((field)=>
field?.trim()==="") // throws error even if 1 field is empty after removing spaces
){
    throw new ApiError(400,"All fields are required");
}
    if(isExist){
        throw new ApiError(422,"User already Exist with this email")
    }
const user= await User.create({
    email,password,name
})
const createdUser= await User.findById(user._id).select(
   " -password" )
  if(!createdUser){
    throw new ApiError(500,"something went wrong while creating user")
  }
  const token= await generateAccessToken(user._id);

  return res.status(201).cookie("token",token).json(
    new ApiResponse(200,createdUser,token,"User Registered Successfully!!!")
  )


})

const loginController= asyncHandler(async(req,res)=>{
    const user= await User.findOne({email})
    if(!user){
        throw new ApiError(401,"User not found")
    }
    const isPasswordCorrect=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
    throw new ApiError(401,"user dosent credentials");
 }
 const token=await generateAccessToken(user_.id);

  return res.status(200).cookie("token",token).json(
    new ApiResponse(200,user,token,"User loggedIn Successfully!!!"))
})


export {userRegisterController,loginController}