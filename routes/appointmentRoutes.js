import express from 'express'
import { createApointment, getApointmentsByDate, getAppointmentById, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .post(authMiddleware, createApointment)
    .get(authMiddleware, getApointmentsByDate)

router.route('/:id')    
    .get(authMiddleware, getAppointmentById)
    .put(authMiddleware, updateAppointment)
    .delete(authMiddleware, deleteAppointment)

export default router