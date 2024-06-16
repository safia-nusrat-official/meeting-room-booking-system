import { z } from 'zod'

const emailValidation = z.string().refine(value=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value)
}, {
    message:"Please provide a valid email."
})

const passwordValidation = z.string().refine(value=>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*?_+-])[A-Za-z\d@!#$%^&*?_+-]{8,32}$/;
    return passwordRegex.test(value)
}, {
    message:"Password must be atleast 8 characters long and contain numbers including atleast one capital letter, one small letter and any of the symbols: ! @ # $ % ^ & * ?"
})

const signUpValidation = z.object({
    body: z.object({
        name: z.string(),
        email: emailValidation,
        password: passwordValidation,
        phone: z.string(),
        role: z.enum(['admin', 'user']),
        address: z.string(),
    }),
})
const loginValidation = z.object({
    body:z.object({
        email: emailValidation,
        password: passwordValidation,
    })
})

export const authValidations = { signUpValidation, loginValidation }
