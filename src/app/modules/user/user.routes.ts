import express from "express"
import { userControllers } from "./user.controller"

const router = express.Router()

router.get("/", userControllers.getAllUsers)

export const userRoutes = router
