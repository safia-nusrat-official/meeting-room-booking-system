import moment from "moment"

export function generateBookingId() {
    const timestamp = Date.now().toString(36)
    const randomString = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()

    return `BOOK-${timestamp}-${randomString}`
}
