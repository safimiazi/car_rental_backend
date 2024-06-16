import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { carServices } from "./car.service";

const createCar = catchAsync(async (req, res) => {
  const result = await carServices.createCarIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Car created successfully",
    data: result,
  });
});

const getAllCars = catchAsync(async (req, res) => {
  const result = await carServices.getAllCarsFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Cars retrieved successfully",
    data: result,
  });
});
const getSingleCar = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await carServices.getSingleCarFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "A Car retrieved successfully",
    data: result,
  });
});
const updateCar = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await carServices.updateCarIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car updated successfully",
    data: result,
  });
});
const deleteCar = catchAsync(async (req, res) => {
  const {id} = req.params;
  const result = await carServices.deleteCarFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car Deleted successfully",
    data: result,
  });
});

const returnCar = catchAsync(async(req, res)=> {
  const result = await carServices.returnCar(req.body)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car returned successfully",
    data: result,
  });
})

export const carController = {
  createCar,
  getAllCars,getSingleCar,updateCar,deleteCar,returnCar
};
