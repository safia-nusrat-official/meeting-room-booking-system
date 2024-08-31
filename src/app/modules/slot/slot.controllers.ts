import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { slotServices } from "./slot.services"
import { dateValidation } from "./slot.validations"

const createSlot = catchAsync(async (req, res) => {
    const result = await slotServices.insertSlotIntoDB(req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "Slots created successfully!",
        },
        res
    )
})

const getAvailableSlots = catchAsync(async (req, res) => {
    if (req.query?.date) {
        const validateDate = dateValidation
        if (!validateDate.safeParse(req.query?.date).success) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `Invalid date format in query. Expected format: 'YYYY-MM-DD'`
            )
        }
    }
    const result = await slotServices.getAvailableSlotsFromDB(req.query)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            meta: result.meta,
            data: result.data,
            message: "Available slots retrieved successfully!"
        },
        res
    )
})

const getAllSlots = catchAsync(async (req, res) => {
    if (req.query?.date) {
        const validateDate = dateValidation
        if (!validateDate.safeParse(req.query?.date).success) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `Invalid date format in query. Expected format: 'YYYY-MM-DD'`
            )
        }
    }
    const result = await slotServices.getAllSlotsFromDB(req.query)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            meta: result.meta,
            data: result.data,
            message: "All slots retrieved successfully!"
        },
        res
    )
})

export const slotControllers = {
    createSlot,
    getAvailableSlots,
    getAllSlots,
}
