import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
app.use(express.json({
    limit:"16kb",
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"));
app.use(cookieParser());
//Routers
import authRouter from "./routes/auth.routes.js"
//router decleration
app.use("/api/auth",authRouter);
export {app}