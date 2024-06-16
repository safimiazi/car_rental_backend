"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carModel = void 0;
const mongoose_1 = require("mongoose");
const car_constant_1 = require("./car.constant");
const carSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
    isElectric: {
        type: Boolean,
        required: true,
        trim: true,
    },
    features: {
        type: [String],
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    status: {
        type: String,
        enum: car_constant_1.carStatus,
        default: "available",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
carSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.carModel = (0, mongoose_1.model)("Car", carSchema);
