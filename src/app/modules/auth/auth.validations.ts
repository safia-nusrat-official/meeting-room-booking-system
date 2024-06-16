import { z } from 'zod'

const signUpValidation = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().refine(value=>{
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(value)
        }, {
            message:"Please provide a valid email."
        }),
        password: z.string().refine(value=>{
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*?_+-])[A-Za-z\d@!#$%^&*?_+-]{8,32}$/;
            return passwordRegex.test(value)
        }, {
            message:"Password must be atleast 8 characters long and contain numbers including atleast one capital letter, one small letter and any of the symbols: ! @ # $ % ^ & * ?"
        }),
        phone: z.string(),
        role: z.enum(['admin', 'user']),
        address: z.string(),
    }),
})

export const authValidations = { signUpValidation }
