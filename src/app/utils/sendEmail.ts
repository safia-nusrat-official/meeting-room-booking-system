import nodemailer from "nodemailer"
import config from "../config"
import { TBooking } from "../modules/booking/booking.interface"

type TClientData = {
    clientName: String
    clientEmail: String
    bookingData: TBooking
}
export const sendEmail = async (clientdata: TClientData, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env === "production",
        auth: {
            user: "sattarabdussattar23@gmail.com",
            pass: "lbwf qtry clgw ogua",
        },
    })

    await transporter.sendMail({
        from: "sattarabdussattar23@gmail.com",
        to: `${clientdata.clientEmail}`,
        subject: "Your Booking Confirmation with MeetWise",
        text: "We are pleased to confirm your booking with MeetWise!",
        html: `
            <p>Dear ${clientdata.clientEmail},</p>
            <p>We are pleased to confirm your booking with <b>MeetWise</b>!</p>
            <p>Thank you for choosing our platform for your meeting room needs. Below is a summary of your booking details and payment information:</p>
            <hr></hr>



            <p>If you have any questions or need further assistance, please feel free to reach out to our support team at <a>[support@meetwise.com</a>.</p>

            <p>We look forward to hosting your meeting and hope you have a productive and seamless experience!</p>

            <p>Warm regards,<br>The MeetWise Team</p>
        `,
    })
}
