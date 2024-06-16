import express from "express"

const router = express.Router()
const applicationRoutes = [
    {
        path:'/users',
        route:
    },
]

applicationRoutes.forEach((route)=>router.use(route.path, route.route))

export default router