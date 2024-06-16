import { Schema, model } from "mongoose";
import { TBook } from "./booking.interface";
import { number } from "zod";

const bookSchema = new Schema<TBook>({
    date: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
        
    },
    startTime: {
        type: String,
        required:true
    },
    endTime: {
        type: String,
        default: null
    },
    totalCost: {
        type:Number,
        default: 0
    }
}, {
    timestamps: true
})

export const bookingModel = model<TBook>('Booking', bookSchema);
