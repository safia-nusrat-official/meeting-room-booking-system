import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { bookingServices } from "./booking.services"

const createBooking = catchAsync(async (req, res) => {
    const result = await bookingServices.insertBookingIntoDB(req.body, req.user)
    sendResponse({
        data:result,
        statusCode:200,
        success:true,
        message:"Booking created successfully!"
    }, res)
})

export const bookingControllers = {createBooking}