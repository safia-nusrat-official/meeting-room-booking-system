import { Model } from "mongoose"
import { USER_ROLES } from "./auth.constants"

export interface TUser {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role: "admin" | "user"
}

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
