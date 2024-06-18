import express from "express"
import { authControllers } from "./auth.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { authValidations } from "./auth.validations"
import { auth } from "../../middlewares/auth"
import { USER_ROLES } from "./auth.constants"

const router = express.Router()

router.post(
    "/signup",
    validateRequest(authValidations.signUpValidation),
    authControllers.signup
)
router.post(
    "/login",
    validateRequest(authValidations.loginValidation),
    authControllers.login
)
router.get("/users", auth(USER_ROLES.admin), authControllers.getAllUsers)

export const authRoutes = router
