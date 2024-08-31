import mongoose from "mongoose"
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../errors/AppError"
import { TSlot } from "./slot.interface"
import { Slot } from "./slot.model"
import { Room } from "../room/room.model"
import { generateSlotTimes } from "./slot.utility"
import httpStatus from "http-status"

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
        if(result){
            console.log(result)
            return result
        }
    }
    const slotQuery = new QueryBuilder(Slot.find({}).populate("room"), query)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await slotQuery.modelQuery
    const meta = await slotQuery.countDocuments()
    return { meta, data: result }
}
const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
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

export const slotServices = {
    insertSlotIntoDB,
    getAllSlotsFromDB,
    getAvailableSlotsFromDB,
}
