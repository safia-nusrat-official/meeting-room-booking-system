import { Types } from 'mongoose'

export interface TBooking {
    date: string
    slots: Types.ObjectId[]
    room: Types.ObjectId
    user: Types.ObjectId
    totalAmount?: number
    isConfirmed?: 'confirmed' | 'unconfirmed' | 'canceled'
    isDeleted?: boolean
}
