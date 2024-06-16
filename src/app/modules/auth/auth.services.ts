import { TUser } from './auth.interface'
import { User } from './auth.model'

const insertUserIntoDB = async (payload: TUser) => {
    /**
     * step-1: to signup user, sign a token with jwt, insert to mongoDB
     * do the insert to db part first
     * 
     * step-2: hash password before saving into db
     */

    const result = await User.create(payload)
    return result
}

export const authServices = {
    insertUserIntoDB
}