import express from "express"
import { roomControllers } from "./room.controllers"
import { validateRequest } from "../../middlewares/validateRequest"
import { roomValidations } from "./room.validations"
import { auth } from "../../middlewares/auth"

const router = express.Router()

router.post(
    "/",
    auth("admin"),
    validateRequest(roomValidations.createRoomSchemaValidation),
    roomControllers.createRoom
)
router.put(
    "/:id",
    auth("admin"),
    validateRequest(roomValidations.updateRoomSchemaValidation),
    roomControllers.updateRoom
)

router.get("/:id", roomControllers.getRoomById)
router.get("/", roomControllers.getAllAvailableRooms)
router.delete("/:id", auth("admin"), roomControllers.deleteRoom)

export const roomRoutes = router
