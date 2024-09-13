import mongoose from "mongoose"
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import { Room } from "../room/room.model"
import { Slot } from "../slot/slot.model"
import { TBooking, TBookingStatus } from "./booking.interface"
import { Booking } from "./booking.model"
import httpStatus from "http-status"
import { JwtPayload } from "jsonwebtoken"
import QueryBuilder from "../../builder/QueryBuilder"
import { mapOfCannotUpdateStatusFromAndTo } from "./booking.constants"
import { TUser } from "../user/user.interface"
import { generateBookingId } from "../../utils/generateBookingId"
import moment from "moment"
import { sendEmail } from "../../utils/sendEmail"

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

        // to remove any duplicate slots from being booked
        const uniqueSlotIds = [...new Set(slots)]

        for (const slotId of uniqueSlotIds) {
            const slotExists = await Slot.findOne({ _id: slotId })
            if (!slotExists) {
                throw new AppError(404, `Slot not found`)
            }
            if (slotExists.date !== date) {
                throw new AppError(
                    404,
                    `No slot ${slotExists.startTime}-${slotExists.endTime} not found on ${date} in ${roomExists.name}.`
                )
            }
            if (slotExists.room._id.toString() !== room.toString()) {
                throw new AppError(
                    404,
                    `No slot ${slotExists.startTime}-${slotExists.endTime} found on ${date} that belongs to room no. ${roomExists.roomNo}.`
                )
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
        const totalAmount = uniqueSlotIds.length * roomExists.pricePerSlot
        const insertBooking = await Booking.create(
            [
                {
                    date,
                    user,
                    bookingId: generateBookingId(),
                    room,
                    slots: uniqueSlotIds,
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
        Booking.find({ isDeleted: query.isDeleted || false })
            .populate("user")
            .populate("room")
            .populate("slots"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await bookingQuery.modelQuery
    const meta = await bookingQuery.countDocuments()
    return { data: result, meta }
}
const getUserBookingsFromDB = async (
    email: string,
    query: Record<string, unknown>
) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(404, `User not found.`)
    }
    const bookingQuery = new QueryBuilder(
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

    const result = await bookingQuery.modelQuery
    const meta = await bookingQuery.countDocuments()
    return { data: result, meta }
}
const getASingleBookingFromDB = async (_id: string) => {
    const result = await Booking.findOne({ _id })
        .populate("user")
        .populate("room")
        .populate("slots")

    if (!result) {
        throw new AppError(404, `Booking not found.`)
    }
    if (result.isDeleted) {
        throw new AppError(404, `Booking has been deleted.`)
    }
    return result
}
const updateBookingStatusIntoDB = async (
    id: string,
    user: JwtPayload,
    payload: Pick<TBooking, "isConfirmed" | "paymentMethod">
) => {
    console.log(user)
    // unconfirmed booking => can be confirmed or cancelled
    // confirmed booking => can't be cancelled
    // cancelled booking => slots.isBooked => false

    // can't updated bookings of a deleted user
    const userExists = await User.findOne({ _id: user._id })
    if (!userExists || userExists.isDeleted) {
        throw new AppError(404, `Can't update bookings of a deleted user`)
    }
    const session = await mongoose.startSession()
    const booking = await Booking.findById(id)
    if (!booking) {
        throw new AppError(404, `Booking not found.`)
    }
    if (booking.isConfirmed === "canceled") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Booking has been cancelled.`
        )
    }
    if (booking.isConfirmed === "confirmed") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Booking has been confirmed already.`
        )
    }
    if (booking.isDeleted) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Booking has been deleted already.`
        )
    }

    const currentStatus = booking?.isConfirmed as TBookingStatus
    const newStatus = payload?.isConfirmed as TBookingStatus

    if (
        mapOfCannotUpdateStatusFromAndTo[currentStatus] &&
        mapOfCannotUpdateStatusFromAndTo[currentStatus][newStatus]
    ) {
        throw new AppError(
            400,
            `Can't update booking status from ${currentStatus} to ${newStatus}. You can either confirm or cancel an unconfirmed booking.`
        )
    }

    try {
        session.startTransaction()

        // when a booking is cancelled by user, the isBooked status of the slots that were associated with the booking will become false
        console.log(`Slots of current booking`, booking.slots)
        let result: any
        if (payload.isConfirmed === "canceled") {
            if (booking?.slots?.length > 0) {
                for (const slotId of booking.slots) {
                    console.log(slotId)
                    await Slot.findByIdAndUpdate(
                        slotId,
                        {
                            $set: {
                                isBooked: false,
                            },
                        },
                        { new: true, session }
                    )
                }
            }

            result = await Booking.findByIdAndUpdate(
                id,
                {
                    $set: {
                        isConfirmed: payload.isConfirmed,
                    },
                },
                { new: true, session }
            )
        }

        // when a booking is confirmed by user, the isBooked status of the slots that were associated with the booking will become false
        else if (
            payload.isConfirmed === "confirmed" &&
            payload?.paymentMethod
        ) {
            result = await Booking.findByIdAndUpdate(
                id,
                {
                    $set: {
                        isConfirmed: payload.isConfirmed,
                        paymentMethod: payload.paymentMethod,
                        paymentDate: new Date(),
                    },
                },
                { new: true, session }
            )
        }

        await session.commitTransaction()
        await session.endSession()

        console.log(result)

        const emailSuccessful = await sendEmail({
            clientName: userExists.name,
            clientEmail: userExists.email,
            bookingId: result._id,
        })
        console.log(emailSuccessful)

        return result
    } catch (error: any) {
        await session.abortTransaction()
        await session.endSession()
        console.log(error)
        throw new error()
    }
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
    getUserBookingsFromDB,
    updateBookingStatusIntoDB,
    deleteBookingFromDB,
    getASingleBookingFromDB,
}
