import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../config'
import AppError from '../../errors/AppError'
import { roomSearchableFields } from './room.constants'
import { TRoom } from './room.interface'
import { Room } from './room.model'
import httpStatus from 'http-status'

const insertRoomIntoDB = async (payload: TRoom) => {
    const result = await Room.create(payload)
    return result
}
const getSingleRoomById = async (id: string) => {
    const result = await Room.findById(id)
    if (!result) {
        throw new AppError(404, `Room not found.`)
    }
    return result
}
const getAllRooms = async (query: Record<string, unknown>) => {
    const roomQuery = new QueryBuilder(Room.find(), query)
        .search(roomSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await roomQuery.modelQuery
    return result
}
const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
    const { amenities, ...primitiveFields } = payload
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const room = await Room.findById(id)
        if (!room) {
            throw new AppError(404, 'Room not found.')
        }
        if (Object.keys(payload).includes("isDeleted")) {
            throw new AppError(404, "You can't update isDeleted field via PUT route.")
        }
        if (amenities && amenities.length) {
            await Room.findOneAndUpdate(
                { _id: id },
                {
                    $addToSet: { amenities: { $each: amenities } },
                },
                { session }
            )
        }
        const result = await Room.findOneAndUpdate(
            { _id: id },
            primitiveFields,
            { new: true, session }
        )
        await session.commitTransaction()
        await session.endSession()
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        await session.endSession()
        throw error
    }
}

const deleteRoomFromDB = async (id: string) => {
    // make sure to delete all slots referenced to this room
    // check if the room to be deleted exists!
    // check if the room to be deleted is already deleted
    const room = await Room.doesRoomExist(id)
    if(!room){
        throw new AppError(404, `Room not found.`)
    }
    if(room.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND, `Room already deleted`)
    }
    const result = await Room.findByIdAndUpdate(id, { isDeleted: true }, {new:true})
    return result
}
export const roomServices = {
    insertRoomIntoDB,
    getSingleRoomById,
    getAllRooms,
    updateRoomIntoDB,
    deleteRoomFromDB,
}
