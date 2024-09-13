import mongoose from "mongoose"
import QueryBuilder from "../../builder/QueryBuilder"
import AppError from "../../errors/AppError"
import { roomSearchableFields } from "./room.constants"
import { TRoom } from "./room.interface"
import { Room } from "./room.model"
import httpStatus from "http-status"

const insertRoomIntoDB = async (payload: TRoom) => {
    const room = await Room.findOne({ roomNo: payload.roomNo })
    if (room) {
        throw new AppError(404, `Room No. ${room.roomNo} already exists.`)
    }
    const result = await Room.create(payload)
    return result
}
const getSingleRoomById = async (id: string) => {
    const result = await Room.findById(id)
    if (!result) {
        throw new AppError(404, `Room not found.`)
    }
    return result
}
const getAllAvailableRooms = async (query: Record<string, unknown>) => {
    const roomQuery = new QueryBuilder(Room.find({ isDeleted: false }), query)
        .search(roomSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()
    const meta = await roomQuery.countDocuments()
    const data = await roomQuery.modelQuery
    return { data, meta }
}
const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
    const { amenities, roomImages, ...primitiveFields } = payload
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const room = await Room.findById(id)
        if (!room) {
            throw new AppError(404, "Room not found.")
        }
        if (room.isDeleted) {
            throw new AppError(404, "Room has been deleted.")
        }
        if (Object.keys(payload).includes("isDeleted")) {
            throw new AppError(
                404,
                "You can't update isDeleted status via PUT route."
            )
        }
        if (amenities && amenities.length) {
            const amenitiesToAdd = amenities.filter(
                (val) => !val.startsWith("-")
            )
            const amenitiesToDelete = amenities
                .filter((val) => val.startsWith("-"))
                .map((val) => val.split("-")[1])

            const removeAmenities = await Room.findOneAndUpdate(
                { _id: id },
                {
                    $pull: { amenities: { $in: amenitiesToDelete } },
                },
                { new: true, session }
            )
            if (!removeAmenities) {
                throw new AppError(500, `Failed to remove amenities.`)
            }

            const addAmenities = await Room.findOneAndUpdate(
                { _id: id },
                {
                    $addToSet: { amenities: { $each: amenitiesToAdd } },
                },
                { new: true, session }
            )
            if (!addAmenities) {
                throw new AppError(500, `Failed to add amenities.`)
            }
        }
        if (roomImages && roomImages.length) {
            const roomImagesToAdd = roomImages.filter(
                (val) => !val.startsWith("-")
            )
            const roomImagesToDelete = roomImages
                .filter((val) => val.startsWith("-"))
                .map((val) => val.substring(1))
            
            const removeRoomImages = await Room.findOneAndUpdate(
                { _id: id },
                {
                    $pull: { roomImages: { $in: roomImagesToDelete } },
                },
                { new: true, session }
            )
            if (!removeRoomImages) {
                throw new AppError(500, `Failed to remove roomImages.`)
            }

            const addRoomImages = await Room.findOneAndUpdate(
                { _id: id },
                {
                    $addToSet: { roomImages: { $each: roomImagesToAdd } },
                },
                { new: true, session }
            )
            if (!addRoomImages) {
                throw new AppError(500, `Failed to add roomImages.`)
            }
        }
        const result = await Room.findOneAndUpdate(
            { _id: id },
            primitiveFields,
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

const deleteRoomFromDB = async (id: string) => {
    const room = await Room.doesRoomExist(id)
    if (!room) {
        throw new AppError(404, `Room not found.`)
    }
    if (room.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, `Room already deleted`)
    }
    const result = await Room.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result
}
export const roomServices = {
    insertRoomIntoDB,
    getSingleRoomById,
    getAllAvailableRooms,
    updateRoomIntoDB,
    deleteRoomFromDB,
}
