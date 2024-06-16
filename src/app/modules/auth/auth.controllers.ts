import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.services";

const signupUser = catchAsync(async (req, res) => {
    console.log(`data received in controller:`, req.body)
    const result = await authServices.insertUserIntoDB(req.body) 
    sendResponse({
        success:true,
        statusCode:200,
        data:result,
        message:"User registered successfully!"
    }, res)
})

export const authControllers = {
    signupUser
}