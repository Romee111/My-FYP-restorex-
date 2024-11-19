import express from "express";
import * as auth from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", auth.signUp);
authRouter.post("/signin", auth.signIn);
authRouter.post("/forgetPassword", auth.forgetPassword);
authRouter.post("/resetPassword", auth.resetPassword);

export default authRouter;
