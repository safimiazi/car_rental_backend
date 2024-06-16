"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoute = void 0;
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const booking_controller_1 = require("./booking.controller");
const express_1 = __importDefault(require("express"));
const booking_validation_1 = require("./booking.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validationRequest_1.default)(booking_validation_1.bookingValidation.carBookingValidation), booking_controller_1.bookingController.carBook);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.bookingController.getAllBooking);
router.get('/my-bookings', (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, auth_1.default)(user_constant_1.USER_ROLE.user), booking_controller_1.bookingController.getUsersBooks);
exports.bookRoute = router;
