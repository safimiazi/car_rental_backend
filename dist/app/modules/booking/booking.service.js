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
exports.bookingServices = exports.getAllBookingFromDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const car_model_1 = require("../car/car.model");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("../user/user.model");
const getAllBookingFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId, date } = query;
    const filter = {};
    if (carId) {
        filter.car = carId;
    }
    if (date) {
        filter.date = date;
    }
    const result = yield booking_model_1.bookingModel.find(filter).populate('car').populate('user');
    return result;
});
exports.getAllBookingFromDB = getAllBookingFromDB;
const carBookIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = user;
    const { carId, date, startTime } = payload;
    if (!userId || !carId || !date || !startTime) {
        throw new Error('Missing required booking information');
    }
    const bookingData = {
        car: carId,
        date: date,
        startTime: startTime,
        user: userId,
    };
    const isCarExist = yield car_model_1.carModel.findById(carId);
    if (!isCarExist) {
        throw new Error('Car not Found!');
    }
    if (isCarExist && isCarExist.isDeleted === true) {
        throw new Error("Car already deleted. you can not book this car!");
    }
    const carStatus = isCarExist.status;
    if (carStatus === "unavailable") {
        throw new Error('Car is already reserved!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const carUpdateResult = yield car_model_1.carModel.findOneAndUpdate({ _id: carId }, { status: "unavailable" }, { new: true, session });
        if (!carUpdateResult) {
            throw new Error('Car not found or unable to update car status');
        }
        const result = yield booking_model_1.bookingModel.create([bookingData], { session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(`Failed to book car: ${error.message}`);
    }
});
const getUsersBooks = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.UserModel.findById(id);
    if (!isUserExist) {
        throw new Error("User does not exists!");
    }
    const result = yield booking_model_1.bookingModel.find({ user: id });
    return result;
});
exports.bookingServices = {
    carBookIntoDB,
    getUsersBooks,
    getAllBookingFromDB: exports.getAllBookingFromDB
};
