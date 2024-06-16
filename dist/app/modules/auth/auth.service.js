"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const signUpUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const isAlreadySignUp = yield user_model_1.UserModel.findOne({ email });
    if (isAlreadySignUp) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You are already signed up with this email, please change email");
    }
    const result = yield user_model_1.UserModel.create(payload);
    return result;
});
const signInUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const userExist = yield user_model_1.UserModel.findOne({ email });
    if (!userExist) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    //if password match:
    const isPasswordMatched = yield bcrypt_1.default.compare(password, userExist.password.toString());
    if (!isPasswordMatched) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Password do not match!");
    }
    //create token and sent to the client:
    const jwtPayload = {
        userId: userExist._id.toString(),
        role: userExist === null || userExist === void 0 ? void 0 : userExist.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token, config_1.default.jwt_access_expires_id);
    return {
        accessToken
    };
});
exports.authServices = {
    signUpUserIntoDB,
    signInUserIntoDB,
};
