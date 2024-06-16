import { Schema, model } from "mongoose";
import { TCar } from "./car.interface";
import { carStatus } from "./car.constant";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const carSchema = new Schema<TCar>(
  {
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
      enum: carStatus,
      default: "available",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

carSchema.pre("find", function (next) {
  this.find({isDeleted : {$ne: true}})
  next()
});




export const carModel = model<TCar>("Car", carSchema);
