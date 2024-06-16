import httpStatus from "http-status";
import QueryBuilder from "../../builder/queryBuilder";
import AppError from "../../errors/appError";
import { carSearchableFields, carStatus } from "./car.constant";
import { TCar } from "./car.interface";
import { carModel } from "./car.model";
import isExist from "./car.utils";
import { bookingModel } from "../booking/booking.model";
import mongoose from "mongoose";

const createCarIntoDB = async (payload: TCar) => {
  const result = await carModel.create(payload);
  return result;
};

const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };
  const carSearchableFields = ["name", "color", "status"];
  let searchTerm = "";
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  const searchQuery = carModel.find({
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
    sort = query.sort as string;
  }
  const sortQuery = filterQuery.sort(sort);

  let page = 1;
  let limit = 10;
  let skip = 0;
  if (query.limit) {
    limit = Number(query?.limit);
  }

  if (query.page) {
    page = Number(query?.page);
    skip = (page - 1) * limit;
  }

  const paginationQuery = sortQuery.skip(skip);
  const limitQuery = paginationQuery.limit(limit);

  let fields = "-__v";

  if (query.fields) {
    fields = (query.fields as string).split(",").join(" ");
  }

  const fieldQuery = await limitQuery.select(fields);

  return fieldQuery;
};

const getSingleCarFromDB = async (id: string) => {
  const result = await isExist(id);

  if (!result) {
    // If the result is null or undefined, throw an error indicating the document was not found
    throw new AppError(httpStatus.NOT_FOUND, "this document already deleted");
  }

  return result;
};

const updateCarIntoDB = async (id: string, payload: Partial<TCar>) => {
  const { features, ...remainingCarData } = payload;
  if (!(await isExist(id))) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "this document already deleted, You can not update"
    );
  }

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingCarData,
  };

  // Non-primitive array field update
  if (features && Array.isArray(features)) {
    features.forEach((feature, index) => {
      modifiedUpdatedData[`features.${index}`] = feature;
    });
  }

  const result = await carModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCarFromDB = async (id: string) => {
  if (!(await isExist(id))) {
    throw new AppError(httpStatus.NOT_FOUND, "this car already deleted!");
  }

  const carStatus = await carModel.findById(id)
if(carStatus && carStatus.status ==="unavailable"){
  throw new Error("This car already booked. you can not delete this!")
}
  const result = await carModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

const returnCar = async (payload: Record<string, unknown>) => {
  const { bookingId, endTime } = payload;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Find the booking by ID
    const carBook = await bookingModel.findById(bookingId).session(session);
    if (!carBook) {
      throw new Error("Booking not found");
    }

    const carId = carBook.car;

    // Update the car status to available
    const updateBookingCarStatus = await carModel.findByIdAndUpdate(
      carId,
      { status: "available" },
      { session, new: true }
    );
    if (!updateBookingCarStatus) {
      throw new Error("Car not found");
    }

    // Calculate the duration and total cost
    const startHours = parseInt(carBook.startTime.split(":")[0]);
    const endHours = parseInt((endTime as string).split(":")[0]);
    const duration = endHours - startHours;
    const pricePerHour = updateBookingCarStatus.pricePerHour;
    const totalCost = duration * (pricePerHour ?? 0);

    // Update the booking's end time and total cost
    await bookingModel.findByIdAndUpdate(
      bookingId,
      { totalCost: totalCost, endTime: endTime },
      { session, new: true }
    );

    // Retrieve the final result with populated fields
    const finalResult = await bookingModel
      .findById(bookingId)
      .populate('car')
      .populate('user')
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return finalResult;
  } catch (error: any) {
    // Abort the transaction in case of error
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`Failed to return car: ${error.message}`);
  }
};
export const carServices = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarIntoDB,
  deleteCarFromDB,
  returnCar,
};
