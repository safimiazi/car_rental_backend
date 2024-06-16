import { z } from "zod";
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeSchema = z.string().refine((time) => timeRegex.test(time), {
  message: "Invalid time format. Expected HH:MM",
});


export const dateFormatSchema = z.string({ required_error: 'Date is required!' }).regex(
  /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  { message: "Invalid date format, expected YYYY-MM-DD" }
);


export const dateSchema = dateFormatSchema.refine(dateStr => {
  const today = new Date();
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr);
  return date >= today;
}, {
  message: "Date cannot be in the past"
}
)
const carBookingValidation = z.object({
  body: z.object({
    carId: z.string(),
    date: dateSchema,
    startTime: timeSchema,
  })
});






export const bookingValidation = {
  carBookingValidation
};
