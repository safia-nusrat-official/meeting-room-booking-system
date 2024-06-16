import mongoose, { Query } from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TSlot } from './slot.interface'
import { Slot } from './slot.model'
import httpStatus from 'http-status'
import { Room } from '../room/room.model'
import { generateSlotTimes } from './slot.utility'

const insertSlotIntoDB = async (payload: TSlot) => {
    /**
     * step-1: check if reference id of room exists & isDeleted===false
     * step-2: create date and get slot duration
     * step-3: divide slot duration by intervals and generate slots for each
     * step-4: Most importantly check if same room same date and same slot times are being created or not! Donot Duplicate
     */

    const { date, room, endTime, startTime } = payload
    const roomExists = await Room.findById(room)
    if (!roomExists) {
        throw new AppError(404, `Room not found.`)
    }
    if (roomExists.isDeleted) {
        throw new AppError(404, `Room deleted.`)
    }
    const startDate = new Date(`${date}T${startTime}:00`)
    const endDate = new Date(`${date}T${endTime}:00`)

    const startSlotMinutes = startDate.getHours() * 60 + startDate.getMinutes()
    const endSlotMinutes = endDate.getHours() * 60 + endDate.getMinutes()

    const totalSlotDuration = endSlotMinutes - startSlotMinutes
    const slotInterval = 60
    const totalNumOfSlots = Math.ceil(totalSlotDuration / slotInterval)

    const slotTimes = generateSlotTimes(
        startSlotMinutes,
        endSlotMinutes,
        slotInterval,
        totalNumOfSlots
    )

    slotTimes.forEach(async (slot) => {
        const insertedSlot = await Slot.create({
            ...slot,
            date,
            room,
        }, {new:true})
        console.log(insertedSlot)
    })
    const result = await Slot.find({ room })
    return result
}
const getAllSlots = async (query: Record<string, unknown>) => {
    const slotQuery = new QueryBuilder(Slot.find({isBooked:false}).populate("room"), query)
        .filter()
        .sort()
        .paginate()
        .fields()
    const result = await slotQuery.modelQuery
    return result
}

const updateSlotIntoDB = async (id: string, payload: Partial<TSlot>) => {}

const deleteSlotFromDB = async (id: string) => {}

export const slotServices = {
    insertSlotIntoDB,
    getAllSlots,
    updateSlotIntoDB,
    deleteSlotFromDB,
}
