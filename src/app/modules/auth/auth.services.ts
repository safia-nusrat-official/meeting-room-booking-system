import fs from 'fs';
import config from "../../config"
import AppError from "../../errors/AppError"
import { TLoginData } from "./auth.interface"
import { User } from "../user/user.model"
import jwt from "jsonwebtoken"
import { TUser } from "../user/user.interface"
import hostImageOnCloud from "../../utils/hostImageOnCloud"

const insertUserIntoDB = async (payload: TUser, file:any) => {
    console.log("file inside services", file)
    let imagePath = ""
    if (file) {
        imagePath = file.path
        const imageName = `profile-pic-${payload.name}`
        const profileImg = await hostImageOnCloud(imagePath, imageName)
        payload.profileImage = profileImg.secure_url
    }else{
        console.log("No images")
        payload.profileImage = ""
    }
    
    const user = await User.doesUserExist(payload.email)
    if (user) {
        throw new Error("User already exists.")
    }

    const result = await User.create(payload)
    if (file) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Image is deleted.');
            }
        });
    }
    return result
}
const loginUser = async (payload: TLoginData) => {
    console.log(payload)
    const user = await User.doesUserExist(payload.email)
    if (!user) {
        throw new AppError(404, "User doesnot exist.")
    }
    if (!(await User.doesPasswordMatch(payload.password, user.password))) {
        throw new AppError(403, "Incorrect Password.")
    }

    const data = {
        email: user.email,
        name: user.name,
        address: user.address,
        phone: user.phone,
        role: user.role,
        _id: user._id,
    }

    const accessToken = jwt.sign(data, config.access_secret as string, {
        expiresIn: "2d",
    })

    return {
        accessToken,
    }
}
export const authServices = {
    insertUserIntoDB,
    loginUser,
}
