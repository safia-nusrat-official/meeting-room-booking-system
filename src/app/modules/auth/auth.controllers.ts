import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { authServices } from "./auth.services"

const signup = catchAsync(async (req, res) => {
    const result = await authServices.insertUserIntoDB(req.body)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: result,
            message: "User registered successfully!",
        },
        res
    )
})
const login = catchAsync(async (req, res) => {
    const { accessToken } = await authServices.loginUser(req.body)

    res.cookie("access-token", accessToken)
    sendResponse(
        {
            success: true,
            statusCode: 200,
            data: {
                accessToken,
            },
            message: "User logged in successfully!",
        },
        res
    )
})
export const authControllers = {
    signup,
    login,
}
