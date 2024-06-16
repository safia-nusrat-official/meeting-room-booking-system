import express from "express"
import { authRoutes } from "../modules/auth/auth.routes"
import { roomRoutes } from "../modules/room/room.routes"

const router = express.Router()
const applicationRoutes = [
    {
        path:'/auth',
        route:authRoutes
    },
    {
        path:'/rooms',
        route:roomRoutes
    },
]

applicationRoutes.forEach((route)=>router.use(route.path, route.route))

export default router