import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { Room } from './room.model'
import { roomServices } from './room.services'

const createRoom = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const result = await roomServices.insertRoomIntoDB(req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Room added successfully!',
        },
        res
    )
})
const updateRoom = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const { id } = req.params;
    const result = await roomServices.updateRoomIntoDB(id, req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Room updated successfully!',
        },
        res
    )
})
const getRoomById = catchAsync(async (req, res) => {
    const result = await roomServices.getSingleRoomById(req.params.id)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Room retrieved successfully!',
        },
        res
    )
})
const getRooms = catchAsync(async (req, res) => {
    const result = await roomServices.getAllRooms(req.query)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: result.length
                ? 'All rooms retrieved successfully!'
                : 'No data found',
        },
        res
    )
})
const deleteRoom = catchAsync(async (req, res) => {
    const result = await roomServices.deleteRoomFromDB(req.params.id)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Room deleted successfully!'
        },
        res
    )
})
export const roomControllers = {
    createRoom,
    getRoomById,
    getRooms,
    deleteRoom,
    updateRoom,
}
