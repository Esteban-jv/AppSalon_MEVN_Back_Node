import express from 'express'
import { getUserAppointment } from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/:user/appointments')
    .get(authMiddleware, getUserAppointment)

export default router