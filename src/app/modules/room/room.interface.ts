import { Model } from "mongoose"

export interface TRoom {
    name: string
    roomNo: number
    description: string
    rating: number
    floorNo: number
    capacity: number
    pricePerSlot: number
    amenities: string[]
    isDeleted?: boolean
    roomImages:string[]
}

export interface TRoomModel extends Model<TRoom> {
    doesRoomExist(id: string): Promise<TRoom> | null
}
