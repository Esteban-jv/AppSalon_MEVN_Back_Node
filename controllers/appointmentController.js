import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import Appointment from '../models/Appointment.js'
import Service from '../models/Services.js'
import { invalidObjectId, handleNotFoundError, formatDate } from '../utils/index.js'
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailDeleteAppointment } from "../emails/appointmentEmailService.js";

// TODO think a way to make it a query
const calculateTotalAmount = services => services.reduce( (carry, service) => carry = carry + service.price, 0 )

const createApointment = async (req, res) => {
    const appointment = req.body
    appointment.user = req.user._id.toString()

    try {
        // Calcula desde el backend el total a pagar segun los servicios
        const servicesObjs = await Service.find({ '_id': { $in: appointment.services} })
        appointment.totalAmount = calculateTotalAmount(servicesObjs)

        const newAppointment = new Appointment(appointment)
        const { date, time } = await newAppointment.save()

        await sendEmailNewAppointment({ date: formatDate(date), time })

        res.json({
            msg: 'La reservación se realizó correctamente'
        })
    } catch (err) {
        console.error(err)
    }
}

const getApointmentsByDate = async (req, res) => {
    const { date } = req.query

    const newDate = parse(date, 'dd/MM/yyyy', new Date())

    if(!isValid(newDate)) {
        const error = new Error('Fecha no válida')
        return res.status(400).json({ msg: error.message })
    }

    const isoDate = formatISO(newDate)

    const appointments = await Appointment.find({ date: {
            $gte : startOfDay(new Date(isoDate)),
            $lte : endOfDay(new Date(isoDate))
        }
    }).select('time')

    res.json(appointments)
}

const getAppointmentById = async (req, res) => {
    const { id } = req.params

    // Validar id
    if(invalidObjectId(id, res)) return

    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
        return handleNotFoundError(res, 'La Cita no existe')
    }

    // Validar usuario
    if(appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes acceso a este recurso')
        return res.status(400).json({ msg: error.message })
    }

    // Retornar la cita
    res.json(appointment)
}

const updateAppointment = async (req, res) => {
    const { id } = req.params

    // Validar id
    if(invalidObjectId(id, res)) return

    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
        return handleNotFoundError(res, 'La Cita no existe')
    }

    // Validar usuario
    if(appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes acceso a este recurso')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const { date, time, services } = req.body

        // Calcula desde el backend el total a pagar segun los servicios
        const servicesObjs = await Service.find({ '_id': { $in: services} })

        appointment.date = date
        appointment.time = time
        appointment.totalAmount = calculateTotalAmount(servicesObjs)
        appointment.services = services

        const result = await appointment.save()

        await sendEmailUpdateAppointment({
            date: formatDate(result.date),
            time: result.time
        })

        res.json({
            msg: 'Cita actualizada correctamente',
            result
        })
    } catch (err) {
        console.error(err)
    }
}

const deleteAppointment = async (req, res) => {
    const { id } = req.params

    // Validar id
    if(invalidObjectId(id, res)) return

    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
        return handleNotFoundError(res, 'La Cita no existe')
    }

    // Validar usuario
    if(appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes acceso a este recurso')
        return res.status(400).json({ msg: error.message })
    }

    try {
        await appointment.deleteOne()
        
        const { date, time } = appointment

        await sendEmailDeleteAppointment({
            date: formatDate(date),
            time
        })

        res.json({msg: 'Se ha cancelado la cita'})
    } catch (err) {
        console.error(err)
    }
}

export {
    createApointment,
    getApointmentsByDate,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
}