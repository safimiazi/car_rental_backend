import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";


const carBook = catchAsync(async (req, res) => {
    console.log(req.user)
  const result = await bookingServices.carBookIntoDB(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message:  "Car booked successfully",
    data: result,
  });
});

const getUsersBooks = catchAsync(async (req, res) => {
    const {userId} = req.user;
                    
    console.log(userId)
  const result = await bookingServices.getUsersBooks(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My Bookings retrieved successfully",
    data: result,
  });
});

const getAllBooking = catchAsync(async (req, res) => {
  const result = await bookingServices.getAllBookingFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: result,
  });
});




export const bookingController = {
  getAllBooking, getUsersBooks, carBook
};
