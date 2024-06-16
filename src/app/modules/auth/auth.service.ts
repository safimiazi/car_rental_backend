import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { TRole, TUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from 'bcrypt'
import { createToken } from "./auth.utils";
import config from "../../config";
import { Types } from "mongoose";
const signUpUserIntoDB = async (payload: TUser) => {
  const { email } = payload;

  const isAlreadySignUp = await UserModel.findOne({ email });

  if (isAlreadySignUp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already signed up with this email, please change email"
    );
  }

  const result = await UserModel.create(payload);
  return result;
};

const signInUserIntoDB = async (payload: TLoginUser) => {
  const { email, password } = payload;
  const userExist = await UserModel.findOne({ email });
  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

//if password match:
const isPasswordMatched = await bcrypt.compare(password, userExist.password.toString());
if (!isPasswordMatched) {
  throw new AppError(httpStatus.FORBIDDEN, "Password do not match!");
}

//create token and sent to the client:
const jwtPayload  = {
  userId:userExist._id.toString() as string,
  role: userExist?.role as string,
}
const accessToken = createToken(jwtPayload, config.jwt_access_token as string,config.jwt_access_expires_id as string)


return {
  accessToken
}
};

export const authServices = {
  signUpUserIntoDB,
  signInUserIntoDB,
};
