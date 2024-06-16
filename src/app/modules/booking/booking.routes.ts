import express from 'express'
import { bookingControllers } from './booking.controllers'
import { auth } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validateRequest'
import { bookingValidations } from './booking.validations'

const router = express.Router()

router.post(
    '/',
    auth('user'),
    validateRequest(bookingValidations.createBookingSchemaValidation),
    bookingControllers.createBooking
)

export const bookingRoutes = router