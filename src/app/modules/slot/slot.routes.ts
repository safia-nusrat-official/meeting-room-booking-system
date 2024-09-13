import express from "express"
import { slotControllers } from "./slot.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { slotValidations } from "./slot.validations"
import { auth } from "../../middlewares/auth"
import { catchAsync } from "../../utils/catchAsync"
import { Slot } from "./slot.model"
import { sendResponse } from "../../utils/sendResponse"

const router = express.Router()

router.post(
    "/create-slot",
    auth("admin"),
    validateRequest(slotValidations.createSlotSchemaValidation),
    slotControllers.createSlot
)
router.get("/availability", slotControllers.getAvailableSlots)
router.get("/", auth("admin"), slotControllers.getAllSlots)
router.get("/single-slot/:id", auth("admin"), slotControllers.getSingleSlot)
router.delete("/:id", auth("admin"), slotControllers.deleteSlot)
router.patch(
    "/:id",
    auth("admin"),
    validateRequest(slotValidations.updateSlotSchemaValidation),
    slotControllers.updateSlot
)
export const slotRoutes = router
