export const generateSlotTimes = (
    startSlotMinutes: number,
    endSlotMinutes: number,
    slotInterval: number,
    totalNumOfSlots: number
) => {
    let slotTimes: { startTime: string; endTime: string }[] = []
    for (let i = 0; i < totalNumOfSlots; i++) {
        let totalStartMinutes = startSlotMinutes + slotInterval * i //
        let totalEndMinutes = startSlotMinutes + slotInterval * (i + 1)

        if (totalEndMinutes > endSlotMinutes) {
            totalEndMinutes = endSlotMinutes
        }

        const slotStartHour = Math.floor(totalStartMinutes / 60)
        const slotStartMinute = totalStartMinutes % 60
        const startSlotTime = `${slotStartHour
            .toString()
            .padStart(2, '0')}:${slotStartMinute.toString().padStart(2, '0')}`

        const slotEndHour = Math.floor(totalEndMinutes / 60)
        const slotEndMinute = totalEndMinutes % 60
        const endSlotTime = `${slotEndHour
            .toString()
            .padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`

        slotTimes.push({
            startTime:startSlotTime,
            endTime:endSlotTime,
        })
    }
    return slotTimes
}
