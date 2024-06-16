import { carModel } from "./car.model";

const isExist = async(id: string) => {
    const foundCar = await carModel.findOne({ _id: id, isDeleted: { $ne: true } });
return foundCar;
}

export default isExist;