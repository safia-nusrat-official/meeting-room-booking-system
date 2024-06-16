import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { Slot } from './slot.model'
import { slotServices } from './slot.services'

const createSlot = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const result = await slotServices.insertSlotIntoDB(req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Slots created successfully!',
        },
        res
    )
})
const updateSlot = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const { id } = req.params
    const result = await slotServices.updateSlotIntoDB(id, req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Slot updated successfully!',
        },
        res
    )
})
const getSlotById = catchAsync(async (req, res) => {
    const result = await slotServices.getSingleSlotById(req.params.id)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Slot retrieved successfully!',
        },
        res
    )
})
const getSlots = catchAsync(async (req, res) => {
    const result = await slotServices.getAllSlots(req.query)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'All slots retrieved successfully!'
        },
        res
    )
})
const deleteSlot = catchAsync(async (req, res) => {
    const result = await slotServices.deleteSlotFromDB(req.params.id)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: 'Slot deleted successfully!',
        },
        res
    )
})
export const slotControllers = {
    createSlot,
    getSlotById,
    getSlots,
    deleteSlot,
    updateSlot,
}
