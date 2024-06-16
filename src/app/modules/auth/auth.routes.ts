import express from "express"
import { authControllers } from "./auth.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { authValidations } from "./auth.validations"

const router = express.Router()

router.post(
    '/signup', 
    validateRequest(authValidations.signUpValidation), 
    authControllers.signup
)
router.post(
    '/login', 
    validateRequest(authValidations.loginValidation), 
    authControllers.login
)

export const authRoutes = router