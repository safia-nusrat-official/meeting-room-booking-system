import express, { NextFunction, Request, Response } from "express"
import { userControllers } from "./user.controller"
import { auth } from "../../middlewares/auth"
import { USER_ROLES } from "../auth/auth.constants"
import { catchAsync } from "../../utils/catchAsync"
import { User } from "./user.model"
import { sendResponse } from "../../utils/sendResponse"
import { upload } from "../../utils/parseFiles"
import { validateRequest } from "../../middlewares/validateRequest"
import { userValidations } from "./user.validation"

const router = express.Router()

router.get("/", auth(USER_ROLES.admin), userControllers.getAllUsers)
router.get("/:id", auth(USER_ROLES.user), userControllers.getSingleUser)
router.patch(
    "/",
    auth(USER_ROLES.user),
    upload.single("profileImage"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(userValidations.updateValidation),
    userControllers.updateUser
)
router.delete("/:id", auth(USER_ROLES.admin), userControllers.deleteUser)

export const userRoutes = router
