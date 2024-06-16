import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import { User } from '../auth/auth.model'
import { Room } from '../room/room.model'
import { Slot } from '../slot/slot.model'
import { TBooking } from './booking.interface'
import { Booking } from './booking.model'
import httpStatus from 'http-status'
import { JwtPayload } from 'jsonwebtoken'

const insertBookingIntoDB = async (
    payload: TBooking,
    userDecoded: JwtPayload
) => {
    const session = await mongoose.startSession()
    const { user, room, slots, date } = payload
    try {
        session.startTransaction()
        const bookingAlreadyExists = await Booking.find({
            $and: [{ room }, { date }, { slots: { $in: slots } }],
        })
        const userExists = await User.findById(user)
        if (!userExists) {
            throw new AppError(404, `User not found`)
        }
        
        if (userDecoded.email !== userExists.email) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                `User logged in with email: ${userDecoded.email} is trying to create a booking for user with email: ${userExists.email}.`
            )
        }
        const roomExists = await Room.findById(room)
        if (!roomExists) {
            throw new AppError(404, `Room not found`)
        }
        if (roomExists.isDeleted) {
            throw new AppError(404, `Room has been deleted.`)
        }
        if (bookingAlreadyExists.length) {
            throw new AppError(
                httpStatus.CONFLICT,
                `A booking has already been placed on ${date} at room no. ${roomExists.roomNo} by ${userExists.email}.`
            )
        }
        for (const slotId of slots) {
            const slotExists = await Slot.findOne({ _id: slotId })
            console.log(slotExists)
            if (!slotExists) {
                throw new AppError(404, `Slot not found`)
            }
            if (slotExists.isBooked) {
                throw new AppError(
                    httpStatus.CONFLICT,
                    `Slot ${slotExists.startTime}-${slotExists.endTime} of room no. ${roomExists.roomNo} is already booked on ${slotExists.date}.`
                )
            }
            
            const updateSlotBookedStatus = await Slot.findOneAndUpdate(
                { _id: slotId },
                {
                    isBooked: true,
                },
                { new: true, session }
            )
            console.log(
                `updated slots status booked true`,
                updateSlotBookedStatus
            )
        
        }
        const totalAmount = slots.length * roomExists.pricePerSlot
        const insertBooking = await Booking.create(
            [
                {
                    ...payload,
                    totalAmount,
                    isConfirmed: 'unconfirmed',
                },
            ],
            { session }
        )
        console.log(`inserted booking`, insertBooking)
        await session.commitTransaction()
        await session.endSession()

        const result = await Booking.findById(insertBooking[0]._id)
            .populate('user')
            .populate('room')
            .populate('slots')
        console.log(`booking in db find`, result)
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw error
    }
}

export const bookingServices = { insertBookingIntoDB }
