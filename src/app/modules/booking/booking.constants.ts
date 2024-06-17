import { TStatusMap } from "./booking.interface";

export const mapOfCannotUpdateStatusFromAndTo:TStatusMap = {
    unconfirmed: { confirmed: false, canceled: false },
    confirmed: { unconfirmed: true, canceled: true },
    canceled: { confirmed: true },
} as const