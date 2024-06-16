import config from '../../config'
import { TRoom } from './room.interface'
import { Room } from './room.model'

const insertRoomIntoDB = async (payload: TRoom) => {
    const result = await Room.create(payload)
    return result
}
export const roomServices = {
    insertRoomIntoDB
}
