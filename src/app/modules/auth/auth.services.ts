import fs from "fs"
import config from "../../config"
import AppError from "../../errors/AppError"
import { TLoginData } from "./auth.interface"
import { User } from "../user/user.model"
import jwt from "jsonwebtoken"
import { TUser } from "../user/user.interface"
import hostImageOnCloud from "../../utils/hostImageOnCloud"

const insertUserIntoDB = async (payload: TUser, file: any) => {
    if (file) {
        const imageName = `profile-pic-${payload.name}`
        const profileImg = (await hostImageOnCloud(
            file.buffer,
            imageName
        )) as any
        payload.profileImage = profileImg.secure_url
    } else {
        payload.profileImage = ""
    }
    
    const user = await User.doesUserExist(payload.email)
    if (user) {
        throw new Error("User already exists.")
    }
    const result = await User.create(payload)
    return result
}
const loginUser = async (payload: TLoginData) => {
    const user = await User.findOne({ email: payload.email }).select(
        "password role phone address email name isDeleted"
    )
    if (!user) {
        throw new AppError(404, "User doesnot exist.")
    }
    if (user.isDeleted) {
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
        _id: user._id as string,
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
