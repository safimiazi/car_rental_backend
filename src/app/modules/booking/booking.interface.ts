import { Types } from "mongoose";

export type TBook = {
    date: string;
    user: Types.ObjectId;
    car: Types.ObjectId;
    startTime: string;
    endTime : string;
    totalCost: number;
}