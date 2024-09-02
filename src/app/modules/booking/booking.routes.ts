import express from "express"
import { bookingControllers } from "./booking.controllers"
import { auth } from "../../middlewares/auth"
import { validateRequest } from "../../middlewares/validateRequest"
import { bookingValidations } from "./booking.validations"

const router = express.Router()
router.post(
    "/create-booking",
    auth("user"),
    validateRequest(bookingValidations.createBookingSchemaValidation),
    bookingControllers.createBooking
)
router.patch(
    "/:id",
    auth("admin", "user"),
    validateRequest(bookingValidations.updateBookingSchemaValidation),
    bookingControllers.updateBookingStatus
)

router.get("/", auth("admin"), bookingControllers.getAllBookings)
router.get("/:id", auth("admin", "user"), bookingControllers.getASingleBooking)
router.get("/my-bookings/:email", auth("user"), bookingControllers.getUserBookings)
router.delete("/:id", auth("admin"), bookingControllers.deleteBooking)

export const bookingRoutes = router
