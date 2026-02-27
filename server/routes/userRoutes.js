import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUesrData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUesrData);


export default userRouter;