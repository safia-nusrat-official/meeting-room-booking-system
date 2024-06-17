import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { dateValidation } from '../slot/slot.validations'
import { bookingServices } from './booking.services'
import AppError from '../../errors/AppError'

const createBooking = catchAsync(async (req, res) => {
    const result = await bookingServices.insertBookingIntoDB(req.body, req.user)
    sendResponse(
        {
            data: result,
            statusCode: 200,
            success: true,
            message: 'Booking created successfully!',
        },
        res
    )
})
const getAllBookings = catchAsync(async (req, res) => {
    if(req.query?.date){
        const validateDate = dateValidation
        console.log(validateDate.safeParse(req.query?.date).success)
        if(!(validateDate.safeParse(req.query?.date).success)){
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid date format in query. Expected format: 'YYYY-MM-DD'`)
        }
    }
    const result = await bookingServices.getAllBookingsFromDB(req.query)
    sendResponse(
        {
            data: result,
            statusCode: 200,
            success: true,
            message: result.length ? 'All bookings retrieved successfully!':'No data found.',
        },
        res
    )
})

const getBookingOfUser = catchAsync(async (req, res) => {
    const result = await bookingServices.getBookingOfUserFromDB(req.user.email, req.query)
    sendResponse(
        {
            data: result,
            statusCode: 200,
            success: true,
            message: result.length ? `User bookings retrieved successfully!`:'No data found.',
        },
        res
    )
})
const updateBookingStatus = catchAsync(async(req, res) => {
    const result = await bookingServices.updateBookingStatusIntoDB(req.params.id, req.body)
    sendResponse(
        {
            data: result,
            statusCode: 200,
            success: true,
            message: 'Booking updated successfully!',
        },
        res
    )
})
export const bookingControllers = { createBooking, updateBookingStatus, getAllBookings, getBookingOfUser }
