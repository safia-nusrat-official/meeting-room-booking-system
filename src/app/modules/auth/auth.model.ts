import { Schema, model } from 'mongoose'
import { TUser, TUserModel } from './auth.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser, TUserModel>({
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
        enum: ['admin', 'user'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
    )
    console.log(this.password)
    next()
})

userSchema.post('save', async function () {
    this.password = ''
})

userSchema.statics.doesUserExist = async function (email: string) {
    return await User.findOne({ email })
}
userSchema.statics.doesPasswordMatch = async function (password: string, hashedPassword:string) {
    return await bcrypt.compare(password, hashedPassword)
}

export const User = model<TUser, TUserModel>('user', userSchema)
