import express from "express"
import { authRoutes } from "../modules/auth/auth.routes"

const router = express.Router()
const applicationRoutes = [
    {
        path:'/auth',
        route:authRoutes
    },
]

applicationRoutes.forEach((route)=>router.use(route.path, route.route))

export default router