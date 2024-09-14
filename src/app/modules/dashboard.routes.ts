import express from "express"
import { catchAsync } from "../utils/catchAsync"
import { Booking } from "./booking/booking.model"
import { sendResponse } from "../utils/sendResponse"
import { Room } from "./room/room.model"
import { User } from "./user/user.model"
import { Slot } from "./slot/slot.model"
import { auth } from "../middlewares/auth"
import { USER_ROLES } from "./auth/auth.constants"

const router = express.Router()
router.get(
    "/",
    auth(USER_ROLES.admin),
    catchAsync(async (req, res) => {
        const totalRooms = await Room.estimatedDocumentCount()
        const totalBookings = await Booking.estimatedDocumentCount()
        const totalSlots = await Slot.estimatedDocumentCount()
        const totalUsers = await User.estimatedDocumentCount()

        const startOfWeek = new Date()
        startOfWeek.setUTCHours(0, 0, 0, 0)
        startOfWeek.setUTCDate(
            startOfWeek.getUTCDate() - startOfWeek.getUTCDay()
        )

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7)

        const revenueAndOtherDetails = await Booking.aggregate([
            {
                $facet: {
                    // getting total revenue and transactions
                    totalRevenueAndPayments: [
                        {
                            $match: {
                                isConfirmed: "confirmed",
                                isDeleted: false,
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$totalAmount" },
                                totalPayments: { $count: {} },
                            },
                        },
                    ],
                    // grouping by payment method to see how many payments were made through stripe and how many were made through paypal
                    paymentMethod: [
                        {
                            $match: {
                                isConfirmed: "confirmed",
                                isDeleted: false,
                            },
                        },
                        {
                            $group: {
                                _id: "$paymentMethod",
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    bookingsThisWeek: [
                        // step-1. get date
                        {
                            $match: {
                                isDeleted: false,
                                createdAt: {
                                    $gt: startOfWeek,
                                    $lt: endOfWeek,
                                },
                            },
                        },
                    ],
                    transactionsThisWeek: [
                        {
                            $match: {
                                isConfirmed: "confirmed",
                                isDeleted: false,
                                paymentDate: {
                                    $gt: startOfWeek,
                                    $lt: endOfWeek,
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        {
                            $unwind: "$user",
                        },
                        {
                            $project: {
                                user: {
                                    name: "$user.name",
                                    email: "$user.email",
                                    profileImage: "$user.profileImage",
                                },
                                totalAmount: 1,
                                date: 1,
                            },
                        },
                        {
                            $sort: { date: -1 },
                        },
                        {
                            $limit: 5,
                        },
                    ],
                    revenueThisWeek: [
                        {
                            $match: {
                                isConfirmed: "confirmed",
                                isDeleted: false,
                            },
                        },
                        {
                            $group: {
                                _id: { $month: "$paymentDate" },
                                totalRevenue: { $sum: "$totalAmount" },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    totalRevenue: {
                        $arrayElemAt: [
                            "$totalRevenueAndPayments.totalRevenue",
                            0,
                        ],
                    },
                    totalPayments: {
                        $arrayElemAt: [
                            "$totalRevenueAndPayments.totalPayments",
                            0,
                        ],
                    },
                    transactionsThisWeek: "$transactionsThisWeek",
                    bookingsThisWeek: "$bookingsThisWeek",
                    revenueThisWeek: "$revenueThisWeek",
                    paymentMethod: "$paymentMethod",
                },
            },
        ])
        const recentUserAcitvities = await User.aggregate([
            {
                $facet: {
                    recentSignUps: [
                        {
                            $match: {
                                isDeleted: false,
                                createdAt: {
                                    $gt: startOfWeek,
                                    $lt: endOfWeek,
                                },
                            },
                        },
                        {
                            $project: {
                                avatar: "$profileImage",
                                name: 1,
                                email: 1,
                                date: "$createdAt",
                                type: "signup",
                                action: "New user signed up",
                            },
                        },
                        {
                            $sort: { date: 1 },
                        },
                    ],
                    recentAdmins: [
                        {
                            $match: {
                                isDeleted: false,
                                updatedAt: {
                                    $gt: startOfWeek,
                                    $lt: endOfWeek,
                                },
                                role: "admin",
                            },
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                avatar: "$profileImage",
                                type: "add_admin",
                                action: "New admin added",
                                date: "$updatedAt",
                            },
                        },
                        {
                            $sort: { date: 1 },
                        },
                    ],
                },
            },
        ])
        const recentBookingActivites = await Booking.aggregate([
            {
                $facet: {
                    recentBookings: [
                        {
                            $match: {
                                isDeleted: false,
                                isConfirmed: {
                                    $ne: "canceled",
                                },
                                createdAt: {
                                    $gt: startOfWeek,
                                    $lt: endOfWeek,
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        {
                            $unwind: "$user",
                        },
                        {
                            $lookup: {
                                from: "rooms",
                                localField: "room",
                                foreignField: "_id",
                                as: "room",
                            },
                        },
                        {
                            $unwind: "$room",
                        },
                        {
                            $project: {
                                date: "$createdAt",
                                type: "room_booking",
                                action: "Booked a room",
                                avatar: "$user.profileImage",
                                name: "$user.name",
                                room: "$room.name",
                            },
                        },
                        {
                            $sort: { date: -1 },
                        },
                        {
                            $limit: 2,
                        },
                    ],
                    recentBookingCancellations: [
                        {
                            $match: {
                                isDeleted: false,
                                isConfirmed: "canceled",
                                updatedAt: {
                                    $gt: startOfWeek,
                                    $lt: endOfWeek,
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        {
                            $unwind: "$user",
                        },
                        {
                            $lookup: {
                                from: "rooms",
                                localField: "room",
                                foreignField: "_id",
                                as: "room",
                            },
                        },
                        {
                            $unwind: "$room",
                        },
                        {
                            $project: {
                                bookingId: 1,
                                name: "$user.name",
                                room: "$room.name",
                                avatar: "$user.profileImage",
                                type: "cancel_booking",
                                action: "Cancelled a booking",
                                date: "$updatedAt",
                            },
                        },
                        {
                            $sort: { date: 1 },
                        },
                    ],
                },
            },
        ])

        const recentActivities: any[] = [
            ...recentUserAcitvities,
            ...recentBookingActivites,
        ]
        const flatActivities = recentActivities
            .map((activityGroup) => Object.values(activityGroup).flat())
            .flat()
            .sort((a: any, b: any) => b.date - a.date)

        const bookedSlots = await Slot.find({
            isBooked: true,
            createdAt: {
                $gt: startOfWeek,
                $lt: endOfWeek,
            },
        })
        const recentlyCreatedRooms = await Room.find({
            createdAt: {
                $gt: startOfWeek,
                $lt: endOfWeek,
            },
        })

        const result = {
            totalRooms,
            totalBookings,
            totalSlots,
            totalUsers,
            recentlyMadeBookings:recentBookingActivites[0]?.recentBookings?.length || 0,
            recentlyCreatedRooms: recentlyCreatedRooms.length,
            newlySignedUps: recentUserAcitvities[0]?.recentSignUps?.length || 0,
            bookedSlots: bookedSlots.length,
            ...revenueAndOtherDetails[0],
            recentActivities: flatActivities.slice(0, 5),
        }
        sendResponse(
            {
                data: result,
                statusCode: 200,
                success: true,
                message: "Revenue retrieved successfully!",
            },
            res
        )
    })
)

export const dashboardRoutes = router
