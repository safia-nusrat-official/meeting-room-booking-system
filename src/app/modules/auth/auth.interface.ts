import { Model } from "mongoose"
import { USER_ROLES } from "./auth.constants"
import { TUser } from "../user/user.interface"

export type TLoginData = {
    email: string
    password: string
}

export type TUserRoles = keyof typeof USER_ROLES

export interface TUserModel extends Model<TUser> {
    doesUserExist(email: string): Promise<TUser> | null
    doesPasswordMatch(
        inputPassword: string,
        hashedPassword: string
    ): Promise<boolean>
}
