import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import { format } from "date-fns"
import es from 'date-fns/locale/es'

function invalidObjectId(id, res) {
    // Validar id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('El ID no es válido')
        return res.status(400).json({
            msg: error.message
        })
    }
}

function handleNotFoundError(res, msg) {
    const error = new Error(msg)
    return res.status(400).json({
        msg: error.message
    })
}

const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

const generateJWT = id => {
    const token = jwt.sign( {id }, process.env.JWT_SECRET, {
        expiresIn: '8h'
    })
    return token
}

function formatDate(date) {
    return format(date, 'PPPP', { locale: es })
}

export {
    invalidObjectId,
    handleNotFoundError,
    uniqueId,
    generateJWT,
    formatDate
}