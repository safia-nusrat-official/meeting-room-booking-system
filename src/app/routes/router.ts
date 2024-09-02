import express from "express"
import { authRoutes } from "../modules/auth/auth.routes"
import { roomRoutes } from "../modules/room/room.routes"
import { slotRoutes } from "../modules/slot/slot.routes"
import { bookingRoutes } from "../modules/booking/booking.routes"
import { userRoutes } from "../modules/user/user.routes"
import { paymentRoutes } from "../modules/payment/payment.routes"
import { dashboardRoutes } from "../modules/dashboard.routes"

const router = express.Router()
const applicationRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/dashboard",
        route: dashboardRoutes,
    },
    {
        path: "/payments",
        route: paymentRoutes,
    },
    {
        path: "/rooms",
        route: roomRoutes,
    },
    {
        path: "/slots",
        route: slotRoutes,
    },
    {
        path: "/users",
        route: userRoutes,
    },
    {
        path: "/bookings",
        route: bookingRoutes,
    },
]

applicationRoutes.forEach((route) => router.use(route.path, route.route))

export default router
