import { Schema, model } from 'mongoose'
import { TBooking } from './booking.interface'

const bookingSchema = new Schema<TBooking>({
    date: {
        type: String,
        required: true,
    },
    slots: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref:"slot"
    },
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'room',
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    isConfirmed: {
        type: String,
        enum: ['canceled', 'confirmed', 'unconfirmed'],
        default: 'unconfirmed',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})

export const Booking = model<TBooking>('booking', bookingSchema)
