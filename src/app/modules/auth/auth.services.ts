import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../config'
import { userSearchableFields } from './auth.constants'
import { TUser, TLoginData } from './auth.interface'
import { User } from './auth.model'
import jwt from 'jsonwebtoken'

const insertUserIntoDB = async (payload: TUser) => {
    const result = await User.create(payload)
    const data = await User.findById(result._id)
    return data
}
const loginUser = async (payload: TLoginData) => {
    const user = await User.doesUserExist(payload.email)
    if (!user) {
        throw new Error('User doesnot exist.')
    }
    if (!(await User.doesPasswordMatch(payload.password, user.password))) {
        throw new Error('Incorrect Password.')
    }
    const accessToken = jwt.sign(payload, config.access_secret as string, {
        expiresIn: '1h',
    })
    return {
        accessToken,
        payload,
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
