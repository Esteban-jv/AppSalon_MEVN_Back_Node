import express from 'express'
import { getServices, createService, getServicesById, updateService, deleteService } from '../controllers/ServicesController.js'

const router = express.Router()

router.route('/')
    .post(createService)
    .get(getServices)

router.route('/:id')
    .get(getServicesById)
    .put(updateService)
    .delete(deleteService)

export default router