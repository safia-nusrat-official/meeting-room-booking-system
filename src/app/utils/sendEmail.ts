import nodemailer from "nodemailer"
import config from "../config"
import { Booking } from "../modules/booking/booking.model"
import AppError from "../errors/AppError"
import moment from "moment"
import { TSlot } from "../modules/slot/slot.interface"

type TClientData = {
    clientName: string
    clientEmail: string
    bookingId: string
}
export const sendEmail = async (clientdata: TClientData) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env === "production",
        auth: {
            user: "sattarabdussattar23@gmail.com",
            pass: "lbwf qtry clgw ogua",
        },
    })
    const bookingData = (await Booking.findById(clientdata.bookingId)
        .populate("room")
        .populate("slots")
        .populate("user")) as any

    if (!bookingData || bookingData.isDeleted) {
        throw new AppError(
            500,
            "Failed to send email because booking has been deleted."
        )
    }
    const emailTemplate = `<div
  style="
    font-family: Inter, sans-serif;
    background-color: #f9f9f9;
    padding: 20px;
    color: #333;
  "
>
  <!-- Main Container -->
  <div
    style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <!-- Header -->
    <div
      style="
        background-color: #007bff;
        padding: 20px;
        text-align: center;
        color: white;
      "
    >
      <h1 style="margin: 0; font-size: 28px">Booking Confirmation</h1>
    </div>

    <!-- Greeting -->
    <div style="padding: 20px">
      <p style="font-size: 20px; margin: 0; font-weight: bold; color: #000000">
        Dear ${clientdata.clientName},
      </p>
      <p style="font-size: 16px; color: #333">
        We are pleased to confirm your booking with <b>MeetWise</b>!
      </p>
      <p style="font-size: 16px; color: #333">
        Thank you for choosing our platform for your meeting room needs. Below
        is a summary of your booking details and payment information:
      </p>
    </div>

    <!-- Booking Summary -->
    <div style="padding: 20px">
      <h2
        style="
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
          font-size: 20px;
          color: #333;
        "
      >
        Booking Details
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px">
        <div style="overflow: hidden; width: 100%">
          <img
            src=${bookingData.room?.roomImages[0]}
            alt="Booked Room"
            style="border-radius: 8px; width: 100%"
          />
        </div>
        <div style="font-size: 26px">
          <p style="margin: 0; font-weight: 800; color: #040f27">
          ${bookingData.room?.name}
          </p>
          <p style="margin: 0; margin-top: 4px; font-size: 16px; color: #666">
            Room No. ${bookingData.room?.roomNo}
          </p>
          <p style="margin: 0; margin-top: 4px; font-size: 16px; color: #666">
            Floor No. ${bookingData.room?.floorNo}
          </p>
          <p style="margin: 0; margin-top: 14px; font-size: 14px; color: #666">
            Booked On <br />
            <span style="font-weight: 600; color: #333; font-size: 16px"
              >${moment(bookingData.date, "YYYY-MM-DD").format(
                  "DD MMMM YYYY"
              )}</span
            >
          </p>
        </div>
      </div>
      <div style="margin-top: 18px; font-weight: 500; margin-bottom: 8px">
        Booked Slots
      </div>
      <div
        style="display: flex; margin-top: 8px; gap: 14px; text-align: center"
      >
        ${
            bookingData.slots.map(
                (slot: TSlot) => `<div
          style="
            font-size: 14px;
            font-weight: bolder;
            flex-direction: column;
            gap: 4px;
            display: flex;
            padding: 8px;
            align-items: center;
            justify-content: space-between;
            border-radius: 6px;
            border: 1px solid #122b4d;
            background-color: #f4f8ff;
          "
        >
          <span>${moment(slot.date, "YYYY-MM-DD").format("Do MMM YYYY")}</span>
          <span style="color: #64748b; font-weight: 400"
            >${moment(slot.startTime, "HH:mm").format("hh:mm a")} - ${moment(
                    slot.endTime,
                    "HH:mm"
                ).format("hh:mm a")}</span
          >
        </div>`
            )
        }
      </div>

      <h2
        style="
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
          font-size: 20px;
          color: #333;
          margin-top: 20px;
        "
      >
        Payment Details
      </h2>
      <p style="margin: 0; font-size: 16px; color: #666">
        Transaction Method:
        <span style="float: right; color: #333">${
            bookingData.paymentMethod
        }</span>
      </p>
      <p style="margin-top: 6px; font-size: 16px; color: #666">
        Amount:
        <span style="float: right; color: #252525; font-weight: bold"
          >$ ${Number(bookingData.totalAmount).toFixed(2)}</span
        >
      </p>

      <h2
        style="
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
          font-size: 20px;
          color: #333;
          margin-top: 20px;
        "
      >
        User Details
      </h2>
      <p style="margin: 0; font-size: 16px; color: #666">
        Email:
        <a style="color: #007bff"
          >${clientdata.clientEmail}</a
        >
      </p>
      <p style="margin: 0; font-size: 16px; color: #666">
        Address: ${bookingData?.user?.address}
      </p>
      <p style="margin: 0; font-size: 16px; color: #666">
        Phone: ${bookingData?.user?.phone}
      </p>
    </div>

    <!-- Additional Information -->
    <div style="padding: 20px; background-color: #f0f0f0; text-align: center">
      <p style="font-size: 14px; color: #666">
        If you have any questions or need further assistance, please feel free
        to reach out to our support team at
        <a href="mailto:support@meetwise.com" style="color: #007bff"
          >support@meetwise.com</a
        >.
      </p>
    </div>

    <!-- Closing -->
    <div style="padding: 20px">
      <p style="font-size: 16px; color: #333">
        We look forward to hosting your meeting and hope you have a productive
        and seamless experience!
      </p>
      <p style="font-size: 16px; color: #333">
        Warm regards,<br />The MeetWise Team
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 10px; font-size: 12px; color: #888">
    <p>&copy; 2024 MeetWise. All rights reserved.</p>
  </div>
</div>
`

    await transporter.sendMail({
        from: "sattarabdussattar23@gmail.com",
        to: `${clientdata.clientEmail}`,
        subject: "Your Booking Confirmation with MeetWise",
        text: `Dear ${clientdata.clientName}, your booking has been confirmed.`,
        html: emailTemplate,
    })
}
