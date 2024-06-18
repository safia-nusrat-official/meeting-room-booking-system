import { z } from "zod"

const emailValidation = z.string().refine(
    (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(value)
    },
    {
        message: "Please provide a valid email such as: example@email.com",
    }
)

const passwordValidation = z.string().refine(
    (value) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*?_+-])[A-Za-z\d@!#$%^&*?_+-]{8,32}$/
        return passwordRegex.test(value)
    },
    {
        message:
            "Password must be atleast 8 characters long and contain numbers including atleast one capital letter, one small letter and any of the symbols: ! @ # $ % ^ & * ?",
    }
)
const phoneValidation = z
    .string()
    .trim()
    .min(15, {
        message:
            "Invalid phone number. Expected 11 digits valid phone number along with country code +880. Example: +880 1717858560",
    })
    .refine(
        (value) => {
            const phoneRegex = /^\+880\s\d{10}$/
            return phoneRegex.test(value)
        },
        {
            message:
                "Invalid phone number. Expected 11 digits valid phone number along with country code +880. Example: +880 1717858560",
        }
    )
    
const nameValidation = z.string({
        message: "Please provide a valid name.",
    })
    .trim()
    .max(32, {
        message: "Name shouldn't be exceeding more than 32 characters.",
    })
    .min(2, { message: "Donot provide an empty string as a name." })

const signUpValidation = z.object({
    body: z.object({
        name: nameValidation,
        email: emailValidation,
        password: passwordValidation,
        phone: phoneValidation,
        role: z.enum(["admin", "user"]),
        address: z.string(),
    }),
})
const loginValidation = z.object({
    body: z.object({
        email: emailValidation,
        password: passwordValidation,
    }),
})

export const authValidations = { signUpValidation, loginValidation }
