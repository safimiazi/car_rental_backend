import mongoose from "mongoose";
import { carModel } from "../car/car.model";
import { TBook } from "./booking.interface";
import { bookingModel } from "./booking.model";
import QueryBuilder from "../../builder/queryBuilder";
import { UserModel } from "../user/user.model";






export const getAllBookingFromDB = async (query: Record<string, unknown>) => {
  const { carId, date } = query;
  const filter: any = {};

  if (carId) {
      filter.car = carId;
  }
  if (date) {
      filter.date = date as string;
  }

  const result = await bookingModel.find(filter).populate('car').populate('user');
  return result;
};


const carBookIntoDB = async (user: any, payload: Record<string, unknown>) => {
  const { userId } = user;
  const { carId, date, startTime } = payload;

  if (!userId || !carId || !date || !startTime) {
    throw new Error('Missing required booking information');
  }

  const bookingData: { car: any; date: string; startTime: string; user: any; } = {
    car: carId,
    date: date as string,
    startTime: startTime as string,
    user: userId,
  };

const isCarExist = await carModel.findById(carId)
if (!isCarExist) {
  throw new Error('Car not Found!');
}

if(isCarExist && isCarExist.isDeleted === true){
  throw new Error("Car already deleted. you can not book this car!")
}

const carStatus = isCarExist.status;
if(carStatus === "unavailable"){
  throw new Error('Car is already reserved!');

}

  const session = await mongoose.startSession();

  try {
    session.startTransaction();




    const carUpdateResult = await carModel.findOneAndUpdate(
      { _id: carId },
      { status: "unavailable" },
      { new: true, session }
    );

    if (!carUpdateResult) {
      throw new Error('Car not found or unable to update car status');
    }

    const result = await bookingModel.create([bookingData], { session });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`Failed to book car: ${error.message}`);
  }
};

const getUsersBooks = async (id: string) => {
const isUserExist = await UserModel.findById(id)
if(!isUserExist){
  throw new Error("User does not exists!")
}

  const result = await bookingModel.find({ user: id });
  return result;
};



export const bookingServices = {
  carBookIntoDB,
  getUsersBooks,
  getAllBookingFromDB
};
