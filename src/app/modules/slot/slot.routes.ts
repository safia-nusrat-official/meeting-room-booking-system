import express from "express"
import { slotControllers } from "./slot.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { slotValidations } from "./slot.validations"
import { auth } from "../../middlewares/auth"

const router = express.Router()

router.post(
    "/create-slot",
    auth("admin"),
    validateRequest(slotValidations.createSlotSchemaValidation),
    slotControllers.createSlot
)
router.get("/availability", slotControllers.getAvailableSlots)
router.get("/", slotControllers.getAllSlots)

export const slotRoutes = router
