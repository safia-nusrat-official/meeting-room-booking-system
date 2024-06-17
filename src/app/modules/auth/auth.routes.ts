import express from "express"
import { authControllers } from "./auth.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { authValidations } from "./auth.validations"
import { auth } from "../../middlewares/auth"

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
router.get('/users', auth('admin'), authControllers.getAllUsers)

export const authRoutes = router