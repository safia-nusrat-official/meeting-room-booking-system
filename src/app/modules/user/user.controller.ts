import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { userServices } from "./user.services"

const getAllUsers = catchAsync(async (req, res) => {
    const result = await userServices.getAllUsersFromDB(req.query)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result.data,
            meta: result.meta,
            message: "All users retrieved successfully!"
        },
        res
    )
})

    
export const userControllers = {
    getAllUsers
}
