import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { Slot } from './slot.model'
import { slotServices } from './slot.services'
import { dateValidation } from './slot.validations'

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

const getSlots = catchAsync(async (req, res) => {
    if(req.query?.date){
        const validateDate = dateValidation
        console.log(validateDate.safeParse(req.query?.date).success)
        if(!(validateDate.safeParse(req.query?.date).success)){
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid date format in query. Expected format: 'YYYY-MM-DD'`)
        }
    }
    let msg='Available slots retrieved successfully!'
    const result = await slotServices.getAllSlots(req.query)
    if(!result.length){
        msg="No data found"
    }
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: msg
        },
        res
    )
})

export const slotControllers = {
    createSlot,
    getSlots,
}
