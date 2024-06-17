import express from "express"
import { bookingControllers } from "./booking.controllers"
import { auth } from "../../middlewares/auth"
import { validateRequest } from "../../middlewares/validateRequest"
import { bookingValidations } from "./booking.validations"

const router = express.Router()
router.post(
    "/",
    auth("user"),
    validateRequest(bookingValidations.createBookingSchemaValidation),
    bookingControllers.createBooking
)
router.put(
    "/:id",
    auth("admin"),
    validateRequest(bookingValidations.updateBookingSchemaValidation),
    bookingControllers.updateBookingStatus
)

router.get("/", auth("admin"), bookingControllers.getAllBookings)
router.delete("/:id", auth("admin"), bookingControllers.deleteBooking)

export const bookingRoutes = router

export const routerToFetchBookingsOfUser = express.Router()
routerToFetchBookingsOfUser.get(
    "/",
    auth("user"),
    bookingControllers.getBookingOfUser
)
