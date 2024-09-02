import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { paymentServices } from "./payment.services"

const createOrderController = catchAsync(async (req, res) => {
    const { totalAmount, bookingId, paymentMethod } = req.body
    console.log(totalAmount, bookingId, paymentMethod)

    const result = await paymentServices.createOrder(Number(totalAmount))

    console.log(result)
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
    console.log("What capture controller received", req.body)
    const { PayPalOrderId } = req.body
    const { httpStatusCode, jsonResponse } = await paymentServices.captureOrder(
        PayPalOrderId
    )

    console.log(jsonResponse)
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
