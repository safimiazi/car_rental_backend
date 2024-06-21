import validationRequest from "../../middlewares/validationRequest";
import { bookingController } from "./booking.controller";
import express from 'express'
import { bookingValidation } from "./booking.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

router.post("/", auth(USER_ROLE.user), validationRequest(bookingValidation.carBookingValidation), bookingController.carBook)
router.get('/',auth(USER_ROLE.user, USER_ROLE.admin), bookingController.getAllBooking);
router.get('/my-bookings',auth(USER_ROLE.user), auth(USER_ROLE.user), bookingController.getUsersBooks);

export const bookRoute = router;