import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const authMiddleware = async ( req, res, next ) => {
    try {
        const { authorization } = req.headers;
        if(authorization && authorization.startsWith('Bearer')) {
            const token = authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // Podemos agregar variables al request y poder acceder desde authRoutes si la ruta pasa pro este middleware
            req.user = await User.findById(decoded.id).select(
                "-password -verified -token -__v"
            )
            next()
        } else {
            const error = new Error('Token no válido')
            res.status(403).json({msg: error.message})
        }   
    } catch /*(err)*/ {
        const error = new Error('La sesión ha expirado')
        res.status(403).json({msg: error.message})
    }
}

export default authMiddleware