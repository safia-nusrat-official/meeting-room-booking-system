import { Types } from "mongoose"

export interface TBooking {
    date: string
    slots: Types.ObjectId[]
    room: Types.ObjectId
    user: Types.ObjectId
    totalAmount?: number
    isConfirmed?: "confirmed" | "unconfirmed" | "canceled"
    isDeleted?: boolean
}
export type TBookingStatus = "confirmed" | "unconfirmed" | "canceled"
export type TStatusMap = {
    [key in TBookingStatus]: {
        [key in TBookingStatus]?: boolean
    }
}
