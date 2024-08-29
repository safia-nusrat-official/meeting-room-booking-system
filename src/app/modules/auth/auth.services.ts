import httpStatus from "http-status"
import QueryBuilder from "../../builder/QueryBuilder"
import config from "../../config"
import AppError from "../../errors/AppError"
import { userSearchableFields } from "./auth.constants"
import { TUser, TLoginData } from "./auth.interface"
import { User } from "./auth.model"
import jwt from "jsonwebtoken"

const insertUserIntoDB = async (payload: TUser) => {
    const user = await User.doesUserExist(payload.email)
    if (user) {
        throw new Error("User already exists.")
    }
    const result = await User.create(payload)
    const data = await User.findById(result._id)
    return data
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
    }

    const accessToken = jwt.sign(data, config.access_secret as string, {
        expiresIn: "2d",
    })

    return {
        accessToken,
    }
}
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await userQuery.modelQuery
    return result
}
export const authServices = {
    insertUserIntoDB,
    loginUser,
    getAllUsersFromDB,
}
