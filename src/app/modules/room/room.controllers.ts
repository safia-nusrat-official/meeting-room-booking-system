import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { roomServices } from "./room.services"

const createRoom = catchAsync(async (req, res) => {
    const result = await roomServices.insertRoomIntoDB(req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "Room added successfully!",
        },
        res
    )
})
const updateRoom = catchAsync(async (req, res) => {
    const { id } = req.params
    if(!Object.keys(req.body).length){
        sendResponse(
            {
                success: true,
                statusCode: 200,
                data: null,
                message: "No data provided to update room.",
            },
            res
        )
        return
    }
    const result = await roomServices.updateRoomIntoDB(id, req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "Room updated successfully!",
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
            message: "Room retrieved successfully!",
        },
        res
    )
})
const getAllAvailableRooms = catchAsync(async (req, res) => {
    const result = await roomServices.getAllRooms(req.query)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result.data,
            meta:result.meta,
            message: result.data.length
                ? "All rooms retrieved successfully!"
                : "No data found",
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
            message: "Room deleted successfully!",
        },
        res
    )
})
export const roomControllers = {
    createRoom,
    getRoomById,
    getAllAvailableRooms,
    deleteRoom,
    updateRoom
}
