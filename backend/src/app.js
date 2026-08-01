import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();
app.use(cors({
    origin:[process.env.CORS_ORIGIN, "http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5500"],
    credentials:true,
}))
app.use(express.json({
    limit:"16kb",
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("pubilc"));
app.use(cookieParser());
//Routers
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transaction.routes.js";
//router decleration
app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)
export {app}