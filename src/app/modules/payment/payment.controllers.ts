import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { paymentServices } from "./payment.services"

const createOrderController = catchAsync(async (req, res) => {
    const { totalAmount, bookingId, paymentMethod } = req.body
    const result = await paymentServices.createOrder(Number(totalAmount))

    sendResponse(
        {
            success: result.httpStatusCode === 201,
            statusCode: result.httpStatusCode,
            data: result.jsonResponse,
            message: "Payment order through paypal created in successfully!",
        },
        res
    )
})

const captureOrderController = catchAsync(async (req, res) => {
    const { PayPalOrderId } = req.body
    const { httpStatusCode, jsonResponse } = await paymentServices.captureOrder(
        PayPalOrderId
    )

    sendResponse(
        {
            success: httpStatusCode === 201,
            statusCode: httpStatusCode,
            data: jsonResponse,
            message: "PayPal Transaction successful!",
        },
        res
    )
})

export const paymentControllers = {
    createOrderController,
    captureOrderController,
}
