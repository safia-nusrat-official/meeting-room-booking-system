import { Model } from "mongoose"

export interface TRoom {
    name: string
    roomNo: number
    floorNo: number
    capacity: number
    pricePerSlot: number
    amenities: string[]
    isDeleted?: boolean
}

export interface TRoomModel extends Model<TRoom> {
    doesRoomExist(id: string): Promise<TRoom> | null
}
