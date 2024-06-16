import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../config'
import AppError from '../../errors/AppError'
import { roomSearchableFields } from './room.constants'
import { TRoom } from './room.interface'
import { Room } from './room.model'

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
export const roomServices = {
    insertRoomIntoDB,
    getSingleRoomById,
    getAllRooms,
}
