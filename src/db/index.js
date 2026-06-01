import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

const connectDB= async ()=>{
try{
const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
 console.log(`\n MongoDB connected sucessfully: DB HOST:${connectionInstance.connection.host}`)
}
catch(error){
console.error("MongoDB connection ERROR",error);
        process.exit(1);
}
}
export default connectDB