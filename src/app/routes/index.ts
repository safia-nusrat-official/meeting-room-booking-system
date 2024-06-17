import express from 'express'
import { authRoutes } from '../modules/auth/auth.routes'
import { roomRoutes } from '../modules/room/room.routes'
import { slotRoutes } from '../modules/slot/slot.routes'
import { bookingRoutes, routerToFetchBookingsOfUser } from '../modules/booking/booking.routes'

const router = express.Router()
const applicationRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/rooms',
        route: roomRoutes,
    },
    {
        path: '/slots',
        route: slotRoutes,
    },
    {
        path: '/bookings',
        route: bookingRoutes,
    },
    {
        path:'/my-bookings',
        route:routerToFetchBookingsOfUser
    }
]

applicationRoutes.forEach((route) => router.use(route.path, route.route))

export default router
