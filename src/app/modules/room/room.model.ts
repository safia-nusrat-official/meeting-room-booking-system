import { Schema, model } from "mongoose"
import { TRoom, TRoomModel } from "./room.interface"

const roomSchema = new Schema<TRoom, TRoomModel>({
    name: {
        type: String,
        required: true,
    },
    roomNo: {
        type: Number,
        required: true,
        unique: true,
    },
    floorNo: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    pricePerSlot: {
        type: Number,
        required: true,
    },
    amenities: {
        type: [String],
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})

roomSchema.statics.doesRoomExist = async function (id: string) {
    return await Room.findById(id)
}
export const Room = model<TRoom, TRoomModel>("room", roomSchema)
