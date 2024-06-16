import express, { Application, Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./app/routes"

const app:Application = express()

app.use(express.json())
app.use(cors({
    origin:['http://localhost:5000/']
}))
app.use(cookieParser())

app.use('/api', router)

app.get('/', async (req:Request, res:Response) => {
    res.send('Server running')
})

export default app