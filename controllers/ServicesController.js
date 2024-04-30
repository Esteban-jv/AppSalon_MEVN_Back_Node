import Service from '../models/Services.js'
import { invalidObjectId, handleNotFoundError } from '../utils/index.js'

const createService = async (req, res) => {
    if(Object.values(req.body).includes('')) {
        const error = new Error('Todos los datos son obligatorios')
        return res.status(400).json({
            msg: error.message
        })
    }
    
    try {
        const service = new Service(req.body)
        await service.save()

        // res.json(result)
        return res.json({
            msg: 'El servicio se creó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const getServices = async (req, res) => {
    try {
        const services = await Service.find()
        res.json(services)
    } catch (err) {
        console.error(err)
    }
}

const getServicesById = async (req, res) => {
    const id = req.params.id
    if(invalidObjectId(id, res)) return

    // Validar que exista
    const service = await Service.findById(id)
    if(!service) {
        return handleNotFoundError(res, 'El servicio no existe')
    }

    // Regresar servicio
    return res.json(service)
}

const updateService = async (req, res) => {
    const id = req.params.id
    // Validar id
    if(invalidObjectId(id, res)) return

    // Validar que exista
    const service = await Service.findById(id)
    if(!service) {
        return handleNotFoundError(res, 'El servicio no existe')
    }

    // Escribimos en el objeto los valores nuevos en caso que existan
    service.name = req.body.name || service.name
    service.price = req.body.price || service.price
    
    try {
        await service.save()
        res.json({
            msg: 'El servicio se actualizó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteService = async (req, res) => {
    const { id } = req.params

    // Validar id
    if(invalidObjectId(id, res)) return

    // Validar que exista
    const service = await Service.findById(id)
    if(!service) {
        return handleNotFoundError(res, 'El servicio no existe')
    }

    try {
        await service.deleteOne()
        res.json({
            msg: 'El servicio se eliminó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    createService,
    getServices,
    getServicesById,
    updateService,
    deleteService
}