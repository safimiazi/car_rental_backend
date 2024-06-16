"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post("/signup", (0, validationRequest_1.default)(user_validation_1.userValidations.createUserValidationSchema), auth_controller_1.authControllers.signupUser);
router.post("/signin", (0, validationRequest_1.default)(auth_validation_1.authValidation.loginValidationSchema), auth_controller_1.authControllers.signinUser);
exports.authRoutes = router;
