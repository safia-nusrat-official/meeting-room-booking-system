import express, { NextFunction, Request, Response } from "express"
import { authControllers } from "./auth.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { authValidations } from "./auth.validations"
import { upload } from "../../utils/parseFiles"

const router = express.Router()

router.post(
    "/signup",
    upload.single('profileImage'),
	(req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
		next();
	},
    validateRequest(authValidations.signUpValidation),
    authControllers.signup
)
router.post(
    "/login",
    validateRequest(authValidations.loginValidation),
    authControllers.login
)

export const authRoutes = router
