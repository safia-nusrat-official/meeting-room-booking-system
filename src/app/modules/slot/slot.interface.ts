import { Model, Types } from "mongoose"

export interface TSlot {
    room: Types.ObjectId
    date: string
    startTime: string
    endTime: string
    isBooked?: boolean
    isDeleted?: boolean
}

export interface TSlotModel extends Model<TSlot> {
    doesSlotExist(id: string): Promise<TSlot> | null
}

export type TSlotTime = { startTime: string; endTime: string }
