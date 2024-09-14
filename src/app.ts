import express, { Application, Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./app/routes/router"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import { notFoundErrorHandler } from "./app/middlewares/notFoundErrorHandler"
import { Room } from "./app/modules/room/room.model"

const app: Application = express()

app.use(express.json())
app.use(
    cors({
        origin: ["http://localhost:5173", "https://meeting-room-booking-system-client.vercel.app"],
        credentials: true,
    })
)
app.use(cookieParser())

app.use("/api", router)

app.get("/", async (req: Request, res: Response) => {
    res.send("MeetWise Server running")
})
app.use(globalErrorHandler)
app.use(notFoundErrorHandler)

export default app
