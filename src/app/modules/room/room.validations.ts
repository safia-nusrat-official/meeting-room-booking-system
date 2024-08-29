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
        rating: z.number(),
        description: z.string(),
        amenities: z.array(
            z.string().min(1, { message: "Don't provide an empty string." })
        ),
        roomImages:z.array(z.string().min(1, { message: "Don't provide an empty string." })).min(1)
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
