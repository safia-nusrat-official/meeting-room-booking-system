import { z } from 'zod'
import { dateValidation } from '../slot/slot.validations'

const createBookingSchemaValidation = z.object({
    body: z.object({
        date: dateValidation,
        room: z.string(),
        user: z.string(),
        slots: z.array(z.string()),
    }),
})

export const bookingValidations = { createBookingSchemaValidation }
