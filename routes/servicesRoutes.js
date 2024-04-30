import express from 'express'
import { getServices, createService, getServicesById, updateService, deleteService } from '../controllers/ServicesController.js'

const router = express.Router()

router.route('/')
    .post(createService)
    .get(getServices)

// router.post('/', createService)
// router.get('/', getServices)

router.route('/:id')
    .get(getServicesById)
    .put(updateService)
    .delete(deleteService)

// router.get('/:id', getServicesById)
// router.put('/:id', updateService)
// router.delete('/:id', deleteService)

export default router