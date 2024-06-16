"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carValidations = void 0;
const zod_1 = require("zod");
const createCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        color: zod_1.z.string(),
        isElectric: zod_1.z.boolean(),
        features: zod_1.z.array(zod_1.z.string()),
        pricePerHour: zod_1.z.number().positive(),
    })
});
const updateCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        isElectric: zod_1.z.boolean().optional(),
        features: zod_1.z.array(zod_1.z.string()).optional(),
        pricePerHour: zod_1.z.number().positive().optional(),
    })
});
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const timeSchema = zod_1.z.string().refine((time) => timeRegex.test(time), {
    message: "Invalid time format. Expected HH:MM",
});
const carReturnValidation = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string(),
        endTime: timeSchema
    })
});
exports.carValidations = {
    createCarValidationSchema, updateCarValidationSchema, carReturnValidation
};
