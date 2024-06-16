import express from 'express'
import { authRoutes } from '../modules/auth/auth.routes'
import { roomRoutes } from '../modules/room/room.routes'
import { slotRoutes } from '../modules/slot/slot.routes'

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
]

applicationRoutes.forEach((route) => router.use(route.path, route.route))

export default router
