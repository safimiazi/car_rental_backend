import  express  from "express";
import validationRequest from "../../middlewares/validationRequest";
import { carValidations } from "./car.validation";
import { carController } from "./car.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post("/create-car",auth(USER_ROLE.admin), validationRequest(carValidations.createCarValidationSchema), carController.createCar)
router.get('/',auth(USER_ROLE.admin, USER_ROLE.user), carController.getAllCars);
router.get('/:id', carController.getSingleCar);
router.put('/return',auth(USER_ROLE.admin), validationRequest(carValidations.carReturnValidation), carController.returnCar);
router.put('/:id',auth(USER_ROLE.admin),validationRequest(carValidations.updateCarValidationSchema), carController.updateCar);
router.delete('/:id',auth(USER_ROLE.admin), carController.deleteCar);


export const carRoutes = router;