import express from 'express';
import validationRequest from '../../middlewares/validationRequest';
import { userValidations } from '../user/user.validation';
import { authControllers } from './auth.controller';
import { authValidation } from './auth.validation';
const router = express.Router();

router.post(
  "/signup",
  validationRequest(userValidations.createUserValidationSchema),authControllers.signupUser
);

router.post("/signin", validationRequest(authValidation.loginValidationSchema), authControllers.signinUser)

export const authRoutes = router;
