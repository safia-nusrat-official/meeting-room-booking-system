import express from 'express'
import { slotControllers } from './slot.controllers'
import { validateRequest } from '../../middlewares/validateRequest'
import { slotValidations } from './slot.validations'
import { auth } from '../../middlewares/auth'

const router = express.Router()

router.post(
    '/',
    auth('admin'),
    validateRequest(slotValidations.createSlotSchemaValidation),
    slotControllers.createSlot
)
router.put(
    '/:id',
    auth('admin'),
    validateRequest(slotValidations.updateSlotSchemaValidation),
    slotControllers.updateSlot
)

router.get('/:id', slotControllers.getSlotById)
router.get('/', slotControllers.getSlots)
router.delete('/:id', auth('admin'), slotControllers.deleteSlot)

export const slotRoutes = router
