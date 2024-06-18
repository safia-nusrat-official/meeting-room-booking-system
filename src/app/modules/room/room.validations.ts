import { z } from "zod"

const createRoomSchemaValidation = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, { message: "Don't provide an empty string as a name" }),
        roomNo: z.number(),
        floorNo: z.number(),
        capacity: z.number(),
        pricePerSlot: z.number(),
        amenities: z.array(
            z.string().min(1, { message: "Don't provide an empty string." })
        ),
    }),
})
const updateRoomSchemaValidation = z.object({
    body: z
        .object({
            name: z
                .string()
                .min(1, { message: "Don't provide an empty string as a name" }),
            roomNo: z.number(),
            floorNo: z.number(),
            capacity: z.number(),
            pricePerSlot: z.number(),
            amenities: z.array(
                z.string().min(1, { message: "Don't provide an empty string." })
            ),
        })
        .partial(),
})

export const roomValidations = {
    createRoomSchemaValidation,
    updateRoomSchemaValidation,
}
