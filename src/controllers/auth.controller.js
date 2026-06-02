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
  const options={
    httpOnly:true,//only modifiable via server
    secure:true
}
  const token= await generateAccessToken(user._id);

  return res.status(201).cookie("token",token,options).json(
    new ApiResponse(200,createdUser,token,"User Registered Successfully!!!")
  )


})

const loginController= asyncHandler(async(req,res)=>{
    const{email,password}=req.body
    if(!email){
    throw new ApiError(400,"email is required");
 }
    const user= await User.findOne({email}).select("+password")
    if(!user){
        throw new ApiError(401,"User not found")
    }
    const isPasswordCorrect=await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
    throw new ApiError(401,"user dosent credentials");
 }
 const loggedInUser=await User.findById(user._id);

 const token=await generateAccessToken(user._id);

const options={
    httpOnly:true,//only modifiable via server
    secure:true
}
  return res.status(200).cookie("token",token,options).json(
    new ApiResponse(200,{
        user: loggedInUser,token
    },"User loggedIn Successfully!!!"))
})


export {userRegisterController,loginController}