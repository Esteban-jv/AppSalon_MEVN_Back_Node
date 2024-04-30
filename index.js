// const express = require('express') //ComonJS
import express from 'express' //ESM
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import { db } from './config/db.js'
import servicesRoutes from './routes/servicesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Variables de entorno
dotenv.config()

// Configurar la aplicacion
const app = express()

// Habilitar leer datos vía body
app.use(express.json())

// Conectar a DB
db()

// Configurar CORS
const whiteList = [
    process.env.FRONTEND_URL
]
if (process.argv[2] === '--all') {
    whiteList.push(undefined) // Para recibir peticiones desde postman
}
const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)) {
            // permitir la conexión
            callback(null, true)
        } else {
            //denegar la conexión
            callback(new Error('CORS error'))
        }
    }
}
app.use(cors(corsOptions))

// Definir una ruta
app.use('/api/services', servicesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/users', userRoutes)

// Definir un puerto
const PORT = process.env.PORT || 4000

// Arrancar la app
app.listen(PORT, () => {
    console.log(colors.blue("El servidor se está ejecutando en el puerto:"), colors.bold.blue(PORT))
})