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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const car_model_1 = require("./car.model");
const car_utils_1 = __importDefault(require("./car.utils"));
const booking_model_1 = require("../booking/booking.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.carModel.create(payload);
    return result;
});
const getAllCarsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = Object.assign({}, query);
    const carSearchableFields = ["name", "color", "status"];
    let searchTerm = "";
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        searchTerm = query.searchTerm;
    }
    const searchQuery = car_model_1.carModel.find({
        $or: carSearchableFields.map((fields) => ({
            [fields]: { $regex: searchTerm, $options: "i" },
        })),
    });
    //filtering:
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    const filterQuery = searchQuery.find(queryObj);
    let sort = "-createdAt";
    if (query.sort) {
        sort = query.sort;
    }
    const sortQuery = filterQuery.sort(sort);
    let page = 1;
    let limit = 10;
    let skip = 0;
    if (query.limit) {
        limit = Number(query === null || query === void 0 ? void 0 : query.limit);
    }
    if (query.page) {
        page = Number(query === null || query === void 0 ? void 0 : query.page);
        skip = (page - 1) * limit;
    }
    const paginationQuery = sortQuery.skip(skip);
    const limitQuery = paginationQuery.limit(limit);
    let fields = "-__v";
    if (query.fields) {
        fields = query.fields.split(",").join(" ");
    }
    const fieldQuery = yield limitQuery.select(fields);
    return fieldQuery;
});
const getSingleCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, car_utils_1.default)(id);
    if (!result) {
        // If the result is null or undefined, throw an error indicating the document was not found
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "this document already deleted");
    }
    return result;
});
const updateCarIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { features } = payload, remainingCarData = __rest(payload, ["features"]);
    if (!(yield (0, car_utils_1.default)(id))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "this document already deleted, You can not update");
    }
    const modifiedUpdatedData = Object.assign({}, remainingCarData);
    // Non-primitive array field update
    if (features && Array.isArray(features)) {
        features.forEach((feature, index) => {
            modifiedUpdatedData[`features.${index}`] = feature;
        });
    }
    const result = yield car_model_1.carModel.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield (0, car_utils_1.default)(id))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "this car already deleted!");
    }
    const carStatus = yield car_model_1.carModel.findById(id);
    if (carStatus && carStatus.status === "unavailable") {
        throw new Error("This car already booked. you can not delete this!");
    }
    const result = yield car_model_1.carModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
const returnCar = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, endTime } = payload;
    // Start a session for the transaction
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Find the booking by ID
        const carBook = yield booking_model_1.bookingModel.findById(bookingId).session(session);
        if (!carBook) {
            throw new Error("Booking not found");
        }
        const carId = carBook.car;
        // Update the car status to available
        const updateBookingCarStatus = yield car_model_1.carModel.findByIdAndUpdate(carId, { status: "available" }, { session, new: true });
        if (!updateBookingCarStatus) {
            throw new Error("Car not found");
        }
        // Calculate the duration and total cost
        const startHours = parseInt(carBook.startTime.split(":")[0]);
        const endHours = parseInt(endTime.split(":")[0]);
        const duration = endHours - startHours;
        const pricePerHour = updateBookingCarStatus.pricePerHour;
        const totalCost = duration * (pricePerHour !== null && pricePerHour !== void 0 ? pricePerHour : 0);
        // Update the booking's end time and total cost
        yield booking_model_1.bookingModel.findByIdAndUpdate(bookingId, { totalCost: totalCost, endTime: endTime }, { session, new: true });
        // Retrieve the final result with populated fields
        const finalResult = yield booking_model_1.bookingModel
            .findById(bookingId)
            .populate('car')
            .populate('user')
            .session(session);
        // Commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return finalResult;
    }
    catch (error) {
        // Abort the transaction in case of error
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(`Failed to return car: ${error.message}`);
    }
});
exports.carServices = {
    createCarIntoDB,
    getAllCarsFromDB,
    getSingleCarFromDB,
    updateCarIntoDB,
    deleteCarFromDB,
    returnCar,
};
