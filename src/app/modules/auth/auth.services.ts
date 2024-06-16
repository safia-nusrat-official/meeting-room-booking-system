import config from '../../config'
import { TUser, TLoginData } from './auth.interface'
import { User } from './auth.model'
import jwt from 'jsonwebtoken'

const insertUserIntoDB = async (payload: TUser) => {
    const result = await User.create(payload)
    return result
}
const loginUser = async (payload: TLoginData) => {
    /**
     * with req.body will come email, password
     *
     * step-1: check if user with *email* exists
     * step-2: check if password matches
     * step-3: sign a token with jwt
     */

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
export const authServices = {
    insertUserIntoDB,
    loginUser,
}
