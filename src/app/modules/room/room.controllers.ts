import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { roomServices } from './room.services'

const createRoom = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const result = await roomServices.insertRoomIntoDB(req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Room created successfully!',
        },
        res
    )
})

export const roomControllers = {
    createRoom
}
