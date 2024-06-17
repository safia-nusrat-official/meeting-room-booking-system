import mongoose from "mongoose"
import AppError from "../../errors/AppError"
import { User } from "../auth/auth.model"
import { Room } from "../room/room.model"
import { Slot } from "../slot/slot.model"
import { TBooking, TBookingStatus } from "./booking.interface"
import { Booking } from "./booking.model"
import httpStatus from "http-status"
import { JwtPayload } from "jsonwebtoken"
import QueryBuilder from "../../builder/QueryBuilder"
import { mapOfCannotUpdateStatusFromAndTo } from "./booking.constants"

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
            if (!slotExists) {
                throw new AppError(404, `Slot not found`)
            }
            if (slotExists.room._id.toString() !== room.toString()) {
                throw new AppError(
                    404,
                    `No slot ${slotExists.startTime}-${slotExists.endTime} not found for room no. ${roomExists.roomNo}.`
                )
            }
            if (slotExists.date !== date) {
                throw new AppError(404, `No slot not found on ${date}.`)
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
            if (!updateSlotBookedStatus) {
                throw new AppError(
                    500,
                    `Failed to update slot isBooked status while creating booking.`
                )
            }
        }
        const totalAmount = slots.length * roomExists.pricePerSlot
        const insertBooking = await Booking.create(
            [
                {
                    ...payload,
                    totalAmount,
                    isConfirmed: "unconfirmed",
                },
            ],
            { session }
        )
        await session.commitTransaction()
        await session.endSession()

        const result = await Booking.findById(insertBooking[0]._id)
            .populate("user")
            .populate("room")
            .populate("slots")
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw error
    }
}
const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
    const bookingQuery = new QueryBuilder(
        Booking.find().populate("user").populate("room").populate("slots"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await bookingQuery.modelQuery
    return result
}
const getBookingOfUserFromDB = async (
    email: string,
    query: Record<string, unknown>
) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(404, `User not found.`)
    }
    const userBookingsQuery = new QueryBuilder(
        Booking.find({ user: user._id })
            .populate("user")
            .populate("room")
            .populate("slots"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = userBookingsQuery.modelQuery
    return result
}
const updateBookingStatusIntoDB = async (
    id: string,
    payload: Pick<TBooking, "isConfirmed">
) => {
    const booking = await Booking.findById(id)
    if (!booking) {
        throw new AppError(404, `Booking not found.`)
    }

    const currentStatus = booking?.isConfirmed as TBookingStatus
    const newStatus = payload?.isConfirmed as TBookingStatus

    if (
        mapOfCannotUpdateStatusFromAndTo[currentStatus] &&
        mapOfCannotUpdateStatusFromAndTo[currentStatus][newStatus]
    ) {
        throw new AppError(
            404,
            `Can't update booking status from ${currentStatus} to ${newStatus}`
        )
    }

    const result = await Booking.findByIdAndUpdate(id, payload, { new: true })
    return result
}

const deleteBookingFromDB = async (id: string) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const booking = await Booking.findById(id)
        if (!booking) {
            throw new AppError(404, `Booking not found`)
        }
        if (booking.isDeleted) {
            throw new AppError(404, `Booking already deleted.`)
        }
        for (const slot of booking.slots) {
            const changeSlotBookedStatus = await Slot.findByIdAndUpdate(
                slot,
                {
                    isBooked: false,
                },
                { session }
            )
            if (!changeSlotBookedStatus) {
                throw new AppError(
                    500,
                    `Failed to update slot isBooked status of the slots in booking.`
                )
            }
        }
        const result = await Booking.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session }
        )
        await session.commitTransaction()
        await session.endSession()
        return result
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw error
    }
}
export const bookingServices = {
    insertBookingIntoDB,
    getAllBookingsFromDB,
    getBookingOfUserFromDB,
    updateBookingStatusIntoDB,
    deleteBookingFromDB,
}
