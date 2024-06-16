import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";

const signupUser = catchAsync(async (req, res) => {
  
    const result = await authServices.signUpUserIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });

})

const signinUser  = catchAsync(async(req, res) => {
const result = await authServices.signInUserIntoDB(req.body)
const {accessToken}  = result;
sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: "User is logged in successfully",
  data: {
    accessToken
  },
});
})

  export const authControllers = {
    signupUser,signinUser
  }