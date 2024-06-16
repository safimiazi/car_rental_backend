"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = exports.dateSchema = exports.dateFormatSchema = void 0;
const zod_1 = require("zod");
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const timeSchema = zod_1.z.string().refine((time) => timeRegex.test(time), {
    message: "Invalid time format. Expected HH:MM",
});
exports.dateFormatSchema = zod_1.z.string({ required_error: 'Date is required!' }).regex(/^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, { message: "Invalid date format, expected YYYY-MM-DD" });
exports.dateSchema = exports.dateFormatSchema.refine(dateStr => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    return date >= today;
}, {
    message: "Date cannot be in the past"
});
const carBookingValidation = zod_1.z.object({
    body: zod_1.z.object({
        carId: zod_1.z.string(),
        date: exports.dateSchema,
        startTime: timeSchema,
    })
});
exports.bookingValidation = {
    carBookingValidation
};
