import { z } from "zod"
import { dateValidation } from "../slot/slot.validations"

const createBookingSchemaValidation = z.object({
    body: z.object({
        date: dateValidation,
        room: z.string(),
        user: z.string(),
        slots: z
            .array(z.string())
            .min(1, { message: "Atleast 1 slot must be selected" }),
    }),
})
const updateBookingSchemaValidation = z.object({
    body: z.object({
        isConfirmed: z.enum(["canceled", "confirmed", "unconfirmed"]),
        paymentMethod: z.enum(["paypal", "stripe"]).optional(),
    }),
})
export const bookingValidations = {
    createBookingSchemaValidation,
    updateBookingSchemaValidation,
}
