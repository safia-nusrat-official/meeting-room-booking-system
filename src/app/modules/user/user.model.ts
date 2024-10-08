import { Schema, model } from "mongoose"
import { TUserModel } from "../auth/auth.interface"
import bcrypt from "bcrypt"
import config from "../../config"
import { TUser } from "./user.interface"

const userSchema = new Schema<TUser, TUserModel>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        profileImage: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
    )
    next()
})

userSchema.post("save", async function () {
    this.password = ""
})

userSchema.statics.doesUserExist = async function (email: string) {
    return await User.findOne({ email }).select(
        "password role phone address email name"
    )
}
userSchema.statics.doesPasswordMatch = async function (
    password: string,
    hashedPassword: string
) {
    return await bcrypt.compare(password, hashedPassword)
}

export const User = model<TUser, TUserModel>("user", userSchema)
