import { Schema, model } from "mongoose"
import { TBooking } from "./booking.interface"

const bookingSchema = new Schema<TBooking>({
    bookingId:{
        type:String,
        required:true
    },
    date: {
        type: String,
        required: true,
    },
    slots: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "slot",
    },
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "room",
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    isConfirmed: {
        type: String,
        enum: ["canceled", "confirmed", "unconfirmed"],
        default: "unconfirmed",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    paymentMethod: {
        type: String,
        enum: ["stripe", "paypal"],
    },
    paymentDate: {
        type: Date,
    },
}, {
    timestamps:true
})

export const Booking = model<TBooking>("booking", bookingSchema)
