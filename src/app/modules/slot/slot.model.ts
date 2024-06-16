import { Schema, model } from 'mongoose'
import { TSlot, TSlotModel } from './slot.interface'

const slotSchema = new Schema<TSlot, TSlotModel>({
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'room',
    },
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    isBooked:{
        type:Boolean,
        default:false
    }
})

slotSchema.statics.doesSlotExist = async function (id: string) {
    return await Slot.findById(id)
}
export const Slot = model<TSlot, TSlotModel>('slot', slotSchema)
