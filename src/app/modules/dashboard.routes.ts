import express from "express"
import { catchAsync } from "../utils/catchAsync"
import { Booking } from "./booking/booking.model"
import { sendResponse } from "../utils/sendResponse"
import { Room } from "./room/room.model"
import { User } from "./user/user.model"
import { Slot } from "./slot/slot.model"

const router = express.Router()

// this is an admin only route!

// data to get
/**
 * 1. Bookings made today
 */
router.get(
    "/",
    catchAsync(async (req, res) => {
        const totalRooms = await Room.estimatedDocumentCount()
        const totalBookings = await Booking.estimatedDocumentCount()
        const totalSlots = await Slot.estimatedDocumentCount()
        const totalUsers = await User.estimatedDocumentCount()
        
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
                    bookingsThisWeek:[
                        // step-1. get date
                        {
                            $match:{
                                
                            }
                        }
                    ]
                },
            },
            {
                $project: {
                    totalRevenue: {
                        $arrayElemAt: ["$totalRevenueAndPayments.totalRevenue", 0],
                    },
                    totalPayments: {
                        $arrayElemAt: ["$totalRevenueAndPayments.totalPayments", 0],
                    }
                },
            },
        ])

        const result = {
            totalRooms,
            totalBookings,
            totalSlots,
            totalUsers,
            ...revenueAndOtherDetails[0],
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
