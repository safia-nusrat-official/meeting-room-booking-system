import { TSlotTime } from "./slot.interface"

export const generateSlotTimes = (
    startSlotMinutes: number,
    endSlotMinutes: number,
    slotInterval: number,
    totalNumOfSlots: number
) => {
    /**
     * Generates the start and end Time of each slot
     *
     * step-1: Run for loop to generate the number of slots provided
     * step-2: To get the start time of the next slot, we need to add the interval to the start time of the previous slot
     * step-3: To get the end time of the next slot, we need to add the interval to the start time of the previous slot; hence increase the loop variable by 1
     * step-4: Ensure the end minutes of next slot is not greater than the endSlotMinutes.
     * step-5: Extract the hour and minutes from and format it as HH:MM for both start and end time of the slot
     * step-6: Wrap the start and end time of the slot as object of type TSlotTime and push it to slotTimes
     *
     * @param {number} startSlotMinutes - Given slot start time in minutes from midnight
     * @param {number} endSlotMinutes - Given slot end time in minutes from midnight
     * @param {number} slotInterval - The duration, each generated slot should be of
     * @param {number} totalNumOfSlots - Number of slots need to generated
     * @returns {Array<TSlotTime>} - An array of objects containg startTime and endTime for each slot
     */

    let slotTimes: TSlotTime[] = []

    for (let i = 0; i < totalNumOfSlots; i++) {
        /*
        suppose, startSlotMinutes is 750 minutes and slotInterval is 60 minutes.
        
        the 1st slot's start time will be = 750 = 750 + (60 * 0); the same as startSlotMintues;
        So the next slot's startTime will be = 750 + 60 = 750 + (60 * 1) = 810 minutes
        similarly, the 3rd slot's startTime will be = 750 + 60 + 60 = 750 + (60 * 2) = 870 minutes

        n.b. similar implementation for nextSlotEndMinutes but, since the 1st slot's endTime will be the same as next slot's startTime = 750+60 = 810 minutes; hence we add +1 to i.
        */
        let nextSlotStartMinutes = startSlotMinutes + slotInterval * i
        let nextSlotEndMinutes = startSlotMinutes + slotInterval * (i + 1)

        // suppose endSlotMinutes is 810. If the end time of the last slot exceeds it, we limit it to 810 minutes, meaning we set it to endSlotMinutes. Because the endTime of last slot must match the given endTime of the slot
        if (nextSlotEndMinutes > endSlotMinutes) {
            nextSlotEndMinutes = endSlotMinutes
        }

        // To extract hour from minutes, we divide by 60
        // To extract the remaining minutes, we use modulus operator inorder to get the remainder
        const nextSlotStartHour = Math.floor(nextSlotStartMinutes / 60)
        const nextSlotStartMinute = nextSlotStartMinutes % 60

        const nextSlotStartTime = `${nextSlotStartHour
            .toString()
            .padStart(2, "0")}:${nextSlotStartMinute
            .toString()
            .padStart(2, "0")}`

        const nextSlotEndHour = Math.floor(nextSlotEndMinutes / 60)
        const nextSlotEndMinute = nextSlotEndMinutes % 60
        const nextSlotEndTime = `${nextSlotEndHour
            .toString()
            .padStart(2, "0")}:${nextSlotEndMinute.toString().padStart(2, "0")}`

        slotTimes.push({
            startTime: nextSlotStartTime,
            endTime: nextSlotEndTime,
        })
    }
    return slotTimes
}
