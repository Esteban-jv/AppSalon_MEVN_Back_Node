import Appointment from "../models/Appointment.js"

const getUserAppointment = async (req, res) => {
    const { user } = req.params

    if(user !== req.user._id.toString()) {
        const error = new Error('Acceso denegado')
        return res.status(403).json({ msg: error.message })
    }

    try {
        const query = req.user.userType ? 
            { date: { $gte : new Date() } }
            :
            { user, date: { $gte : new Date() } }
        const appointments = await Appointment
            .find(query)
            .populate('services')
            .populate({path: 'user', select: 'name email'})
            .sort({ date: 'asc' })
        res.json(appointments)
    } catch (err) {
        console.error(err)
    }
}

export {
    getUserAppointment
}