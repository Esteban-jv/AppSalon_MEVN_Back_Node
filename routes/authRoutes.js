import express from 'express'
import { register, verifyAccount, login, user, admin, forgotPassword, verifyPassowrdResetToken, upadtePassword } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.get('/verify/:token', verifyAccount)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.route('/forgot-password/:token')
    .get(verifyPassowrdResetToken)
    .post(upadtePassword)

// Area Privada - Requiere JWT
router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)

export default router