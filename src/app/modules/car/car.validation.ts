import { z } from "zod";


const createCarValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string(),
        color: z.string(),
        isElectric: z.boolean(),
        features: z.array(z.string()),
        pricePerHour: z.number().positive(),
    })
})
const updateCarValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        isElectric: z.boolean().optional(),
        features: z.array(z.string()).optional(),
        pricePerHour: z.number().positive().optional(),
    })
})


const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeSchema = z.string().refine((time) => timeRegex.test(time), {
  message: "Invalid time format. Expected HH:MM",
});


const carReturnValidation = z.object({
    body: z.object({
      bookingId: z.string(),
      endTime: timeSchema
    })
  })


export const carValidations = {
    createCarValidationSchema,updateCarValidationSchema,carReturnValidation
}