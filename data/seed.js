import dotenv from 'dotenv'
import colors from 'colors'
import { db } from '../config/db.js'
import Service from '../models/Services.js'
import { services } from './beautyServices.js'

dotenv.config()
await db()

async function seedDB() {
    try {
        await Service.insertMany(services)
        console.log(colors.green("Datos insertados correctamente"))
        process.exit(0)
    } catch (err) {
        console.error(colors.red(err))
        process.exit(1)
    }
}

async function clearDB() {
    try {
        await Service.deleteMany()
        console.log(colors.yellow("Datos insertados correctamente"))
        process.exit(0)
    } catch (err) {
        console.error(colors.red(err))
        process.exit(1)
    }
}

if(process.argv[2] === '--import') {
    seedDB()
} else {
    clearDB()
}