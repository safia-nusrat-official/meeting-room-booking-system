import mongoose from 'mongoose'
import app from './app'
import { Server } from 'http'
import config from './app/config'

let server: Server

async function Main() {
    await mongoose.connect(config.db_url as string)
    server = app.listen(config.port, () => {
        console.log('Meeting Room Booking System server running on port: ' + config.port)
    })
}

Main()

process.on('unhandledRejection', () => {
    console.log(`Unhandled Rejection detected. Server shutting down.....`)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on('uncaughtException', () => {
    console.log(`Uncaught Exception detected. Server shutting down.....`)
    process.exit(1)
})
