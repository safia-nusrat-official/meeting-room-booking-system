import mongoose from "mongoose"
import moment from "moment"
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../errors/AppError"
import { TSlot } from "./slot.interface"
import { Slot } from "./slot.model"
import { Room } from "../room/room.model"
import { generateSlotTimes } from "./slot.utility"
import httpStatus from "http-status"
import { TMeta } from "../../utils/sendResponse"

const insertSlotIntoDB = async (payload: TSlot) => {
    /**
     * Creates 60-minute interval slots for a room on a specific date
     *
     * e.g. As there will be more than one write operations to insert each slots, use transaction & rollback
     *
     * step-1: check if the room with the given reference id exists and is not deleted
     * step-2: create start and end Date with given startTime, endTime and calculate total slot duration
     * step-3: divide slot duration by slot interval and generate slots for each interval
     * step-4: Ensure no duplicate slot are created for the same room on same date with same start and end time.
     *
     * @param {TSlot} payload - containing Slot details
     * @returns {Promise<Array<TSlot>>} - The array of slots created for the room
     * @throws {AppError} - Throws an error if a room is not found, deleted or a creation fails
     */

    const session = await mongoose.startSession()
    const { date, room, endTime, startTime } = payload

    const roomExists = await Room.findById(room)
    if (!roomExists) {
        throw new AppError(404, `Room not found.`)
    }
    if (roomExists.isDeleted) {
        throw new AppError(404, `Room of the given room id has been deleted.`)
    }

    const startDate = new Date(`${date}T${startTime}:00`)
    const endDate = new Date(`${date}T${endTime}:00`)

    const startSlotMinutes = startDate.getHours() * 60 + startDate.getMinutes()
    const endSlotMinutes = endDate.getHours() * 60 + endDate.getMinutes()

    const totalSlotDuration = endSlotMinutes - startSlotMinutes
    const slotInterval = 60

    if (totalSlotDuration < slotInterval) {
        throw new AppError(
            400,
            `As the total duration from ${startTime} to ${endTime} is less than 60 minutes no slots were created.`
        )
    }

    const totalNumOfSlots = Math.floor(totalSlotDuration / slotInterval)
    const slotTimes = generateSlotTimes(
        startSlotMinutes,
        endSlotMinutes,
        slotInterval,
        totalNumOfSlots
    )
    try {
        session.startTransaction()
        for (const slot of slotTimes) {
            const slotAlreadyExists = await Slot.findOne({
                ...slot,
                date,
                room,
            })
            if (slotAlreadyExists) {
                throw new AppError(
                    httpStatus.CONFLICT,
                    `There is already a slot created from ${slot.startTime} to ${slot.endTime} on ${date} in room no. ${roomExists.roomNo}`
                )
            }

            const insertedSlot = await Slot.create(
                [
                    {
                        ...slot,
                        date,
                        room,
                    },
                ],
                { new: true, session }
            )

            if (!insertedSlot) {
                throw new AppError(500, `Failed to create slots.`)
            }
        }

        await session.commitTransaction()
        await session.endSession()
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        throw error
    }
    const result = await Slot.find({ room, date }).populate("room")
    return result
}
const getAllSlotsFromDB = async (query: Record<string, unknown>) => {
    if (query.groupBy === "rooms") {
        const result = await new QueryBuilder(Slot.find({}), query).groupData()
        if (result) {
            return result
        }
    }

    if (query?.searchTerm) {
        const result = await Slot.aggregate([
            {
                $lookup: {
                    from: "rooms",
                    foreignField: "_id",
                    localField: "room",
                    as: "room",
                },
            },
            {
                $unwind: "$room",
            },
            {
                $match: {
                    "room.name": { $regex: query.searchTerm, $options: "i" },
                },
            },
            {
                $group: {
                    _id: null,
                    totalDocuments: { $sum: 1 },
                    data: {
                        $push: "$$ROOT",
                    },
                },
            },
        ])
        if (result.length > 0) {
            const totalDocuments = result[0].totalDocuments
            const data = result[0].data
            const meta: TMeta = {
                totalDocuments,
                page: Number(query?.page) || 1,
                limit: Number(query?.limit) || 5,
                totalPages: Math.ceil(totalDocuments / Number(query?.limit)),
            }
            return { meta, data }
        }
    }

    const slotQuery = new QueryBuilder(
        Slot.find({}).populate({
            path: "room",
        }),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await slotQuery.modelQuery
    const meta = await slotQuery.countDocuments()
    return { meta, data: result }
}
const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
    if (query.groupBy === "rooms") {
        const result = await new QueryBuilder(
            Slot.find({ isBooked: false }),
            query
        ).groupData()
        if (result) {
            return result
        }
    }
    const slotQuery = new QueryBuilder(
        Slot.find({ isBooked: false }).populate("room"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await slotQuery.modelQuery
    const meta = await slotQuery.countDocuments()
    return { meta, data: result }
}
const getSingleSlotFromDB = async (id: string) => {
    const result = await Slot.findById(id)
    if (!result) {
        throw new AppError(404, "Slot not found!")
    }
    return result
}

const deleteSlotFromDB = async (id: string) => {
    const slot = await Slot.findById(id)
    if (!slot) {
        throw new AppError(404, "Slot Not Found!")
    }
    if (slot.isBooked) {
        throw new AppError(400, "Slot is Booked!")
    }
    const result = await Slot.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result
}
const updateSlotInDB = async (id: string, payload: Partial<TSlot>) => {
    const slot = await Slot.findById(id)
    if (!slot) {
        throw new AppError(404, "Slot Not Found!")
    }
    if (slot.isBooked) {
        throw new AppError(400, "Slot is Booked!")
    }
    // change the field to new payload values, and if not provided keep the old ones.
    const date = payload.date || slot.date
    const startTime = payload.startTime || slot.startTime
    const endTime = payload.endTime || slot.endTime
    const room = payload.room || slot.room

    const newRoom = await Room.findOne({ _id: room })
    if (newRoom) {
        // if there is already any slot available in room 'x' on date 'y' from 'a' time to time 'b' ? if no => update slot details
        const newRoomAvailableOnThatDate = await Slot.findOne({
            room,
            date,
            startTime,
            endTime,
        })
        if (newRoomAvailableOnThatDate) {
            throw new AppError(
                403,
                `There's already a slot available from ${newRoomAvailableOnThatDate.startTime} to ${newRoomAvailableOnThatDate.endTime} on ${newRoomAvailableOnThatDate.date} in the selected room`
            )
        }
        // before updating check if slot duration is okay or not.
        const slotTimeDifference = moment(endTime, "HH:mm").diff(
            moment(startTime, "HH:mm"),
            "minutes"
        )
        if (slotTimeDifference > 60 || slotTimeDifference < 60) {
            throw new AppError(400, "Default slot duration is 60 minutes!")
        }
        const result = await Slot.findByIdAndUpdate(
            id,
            {
                date,
                startTime,
                endTime,
                room,
            },
            { new: true }
        )
        return result
    }
}

export const slotServices = {
    insertSlotIntoDB,
    updateSlotInDB,
    getAllSlotsFromDB,
    getAvailableSlotsFromDB,
    deleteSlotFromDB,
    getSingleSlotFromDB,
}
