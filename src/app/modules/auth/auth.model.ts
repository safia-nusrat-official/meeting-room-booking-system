import { Schema, model } from 'mongoose'
import { TUser } from './auth.interface'
import bcrypt from "bcrypt"
import config from '../../config'

const userSchema = new Schema<TUser>({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds))
    console.log(this.password)
    next()
})

userSchema.post('save', async function() {
    this.password = ""
})

export const User = model<TUser>('user', userSchema)
