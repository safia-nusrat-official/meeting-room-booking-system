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
const getSingleUser = catchAsync(async (req, res) => {
    const result = await userServices.getSingleUserFromDB(req.params.id, req.user)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "User retrieved successfully!"
        },
        res
    )
})
const updateUser = catchAsync(async (req, res) => {
    const result = await userServices.updateUserInDB(req.params.id, req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "User retrieved successfully!"
        },
        res
    )
})
const deleteUser = catchAsync(async (req, res) => {
    const result = await userServices.deleteUserFromDB(req.params.id)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "User retrieved successfully!"
        },
        res
    )
})

    
export const userControllers = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}
