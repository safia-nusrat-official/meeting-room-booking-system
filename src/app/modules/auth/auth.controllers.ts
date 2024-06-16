import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.services";

const signup = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const result = await authServices.insertUserIntoDB(req.body) 
    sendResponse({
        success:true,
        statusCode:200,
        data:result,
        message:"User registered successfully!"
    }, res)
})
const login = catchAsync(async (req, res) => {
    console.log(`login data received in controller:`, req.body)
    const {accessToken, payload} = await authServices.loginUser(req.body) 
    sendResponse({
        success:true,
        statusCode:200,
        token:accessToken,
        data:payload,
        message:"User logged in successfully!"
    }, res)
})
export const authControllers = {
    signup,
    login
}