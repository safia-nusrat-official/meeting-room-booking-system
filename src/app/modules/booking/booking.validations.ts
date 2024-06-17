import { z } from "zod"
import { dateValidation } from "../slot/slot.validations"

const createBookingSchemaValidation = z.object({
    body: z.object({
        date: dateValidation,
        room: z.string(),
        user: z.string(),
        slots: z.array(z.string()),
    }),
})
const updateBookingSchemaValidation = z.object({
    body: z.object({
        isConfirmed: z.enum(["canceled", "confirmed", "unconfirmed"]),
    }),
})
export const bookingValidations = {
    createBookingSchemaValidation,
    updateBookingSchemaValidation,
}
