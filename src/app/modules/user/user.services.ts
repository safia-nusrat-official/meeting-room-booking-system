import fs from "fs"
import httpStatus from "http-status"
import QueryBuilder from "../../builder/QueryBuilder"
import config from "../../config"
import AppError from "../../errors/AppError"
import { userSearchableFields } from "./user.constants"
import { TUser } from "./user.interface"
import { User } from "./user.model"
import { JwtPayload } from "jsonwebtoken"
import hostImageOnCloud from "../../utils/hostImageOnCloud"
import { USER_ROLES } from "../auth/auth.constants"

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await userQuery.modelQuery
    const meta = await userQuery.countDocuments()
    return { data: result, meta }
}
const getSingleUserFromDB = async (id: string, user: JwtPayload) => {
    const result = await User.findById(id)
    if (!result) {
        throw new AppError(404, "User Not Found!")
    }
    if (result.isDeleted) {
        throw new AppError(404, "User Has Been Deleted!")
    }

    if (result.email !== user?.email) {
        throw new AppError(403, "You can't access another users data!")
    }
    return result
}
const deleteUserFromDB = async (id: string) => {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError(404, "User Not Found!")
    }
    if (user.isDeleted) {
        throw new AppError(404, "User Has Already Been Deleted!")
    }
    const result = await User.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result
}
const updateUserInDB = async (
    id: string,
    payload: Partial<TUser>,
    file?: any
) => {
    console.log("file inside services", file)
    let imagePath = ""
    if (file) {
        imagePath = file.path
        const imageName = `profile-pic-${payload.name}`
        const profileImg = await hostImageOnCloud(imagePath, imageName)
        payload.profileImage = profileImg.secure_url
    } else {
        console.log("No images")
    }
    const user = await User.findById(id)
    if (!user) {
        throw new AppError(404, "User Not Found!")
    }
    if (user.isDeleted) {
        throw new AppError(404, "User Has Been Deleted!")
    }
    const { isDeleted, role, email, ...updateData } = payload
    const result = await User.findByIdAndUpdate(id, updateData, { new: true })
    if (file) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err)
            } else {
                console.log("Image is deleted.")
            }
        })
    }
    return result
}

const changeRoleOfUser = async (
    id: string,
    payload: { role: typeof USER_ROLES }
) => {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError(404, "User Not Found!")
    }
    if (user.isDeleted) {
        throw new AppError(404, "User Has Been Deleted!")
    }
    const result = await User.findByIdAndUpdate(
        id,
        { role: payload.role },
        { new: true }
    )
    return result
}

export const userServices = {
    changeRoleOfUser,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    updateUserInDB,
}
