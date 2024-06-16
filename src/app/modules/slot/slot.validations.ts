import { z } from 'zod'

const timeValidation = z.string().refine(
    (time) => {
        // 9:00
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        return timeRegex.test(time)
    },
    {
        message: `Invalid time format. Expected 24 hour format: 'HH:MM' ; Example: "09:40"`,
    }
)
export const dateValidation = z.string().refine(
    (date) => {
        // "2024-06-15"
        const dateRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
        return dateRegex.test(date)
    },
    {
        message: `Invalid date format. Expected date format: 'YYYY:MM:DD'`,
    }
)
const createSlotSchemaValidation = z.object({
    body: z
        .object({
            room: z.string(),
            date: dateValidation,
            startTime: timeValidation,
            endTime: timeValidation,
        })
        .refine(
            (bodyProps) => {
                const { startTime, endTime, date } = bodyProps
                const startDate = new Date(`${date}T${startTime}:00`)
                const endDate = new Date(`${date}T${endTime}:00`)
                console.log(startTime, endTime)
                return startDate < endDate
            },
            {
                message: `Slot start time can't be before slot end time.`,
            }
        ),
})
const updateSlotSchemaValidation = z.object({
    body: z.object({}),
})

export const slotValidations = {
    createSlotSchemaValidation,
    updateSlotSchemaValidation,
}
