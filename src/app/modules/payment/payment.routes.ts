import express from "express"
import Stripe from "stripe"
import config from "../../config"
import { sendResponse } from "../../utils/sendResponse"

const router = express.Router()
const stripe = new Stripe(config.stripe_secret_key as string)

router.post("/", async (req, res) => {
    try {
        const { totalAmount } = req.body

        const amount = Number(totalAmount) * 100
        console.log(`TotalPayment`, amount)

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
        })

        res.send({
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.log(error)
        sendResponse(
            {
                data: null,
                success: false,
                message: "Failed to create payment intent",
                statusCode: 500,
            },
            res
        )
    }
})

export const paymentRoutes = router
