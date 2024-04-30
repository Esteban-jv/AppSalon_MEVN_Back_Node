import User from "../models/User.js"
import { sendEmailVerification, sendEmailPasswordReset } from "../emails/authEmailService.js"
import { generateJWT, uniqueId } from "../utils/index.js"

const register = async (req, res) => {
    // Valida todos los campos
    if(Object.values(req.body).includes('')) {
        const error = new Error('Todos los datos son obligatorios')
        return res.status(400).json({ msg: error.message })
    }
    const { email, password, name } = req.body

    // Evitar registros duplicados
    const userExists = await User.findOne({ email })
    if(userExists) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    // Valida el passwrod // TODO: Agregar reglas de validación a la contraseña
    if(password.trim().length < 8) {
        const error = new Error('La contraseña debe tener al menos 8 caracteres')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const user = new User(req.body)
        const result = await user.save()

        const { name, email, token } = result
        sendEmailVerification({ name, email, token })

        return res.json({
            msg: 'El usuario se creó correctamente, revisa tu email'
        })
    } catch (error) {
        console.log(error)
    }

}

const verifyAccount = async (req, res) => {
    const { token } =  req.params
    const user = await User.findOne({ token })

    if(!user) {
        const error = new Error('Hubo un error, token no válido')
        return res.status(401).json({ msg: error.message })
    }

    // Si el token es valido confirma la cuenta
    try {
        user.verified = true
        user.token = null
        await user.save()

        return res.json({
            msg: 'Se ha confirmado tu cuenta. Ya puedes cerrar esta ventana'
        })
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    // Revisar que exista el usuario
    const user = await User.findOne({ email })
    if(!user) {
        const error = new Error(`No existe una cuenta para el correo ${email}`)
        return res.status(401).json({ msg: error.message })
    }

    // Verificar que la cuenta esté confirmada
    if(!user.verified) {
        const error = new Error('Tu cuenta no ha sido verificada, revisa tu email')
        return res.status(400).json({ msg: error.message })
    }

    // Verificar password
    if(await user.checkPassword(password)) {
        const token = generateJWT(user._id)
        console.log(token)
        return res.status(200).json({ msg: "Usuario autenticado", token })
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(400).json({ msg: error.message })
    }
}

const user = async (req, res) => {
    const { user } = req
    res.json(user)
}

const admin = async (req, res) => {
    const { user } = req
    
    if(!user.userType) {
        const error = new Error('Acción no válida')
        return res.status(403).json({ msg: error.message })
    }
    res.json(user)
}

const forgotPassword = async (req, res) => {
    const { email } = req.body

    // Comprobar si existe usuarii
    const user = await User.findOne({ email })

    if(!user) {
        const error = new Error(`No existe una cuenta para el correo ${email}`)
        return res.status(404).json({ msg: error.message })
    }

    try {
        user.token = uniqueId()
        const { name, email, token } = await user.save()

        // Enviar email
        await sendEmailPasswordReset({ name, email, token })

        return res.status(200).json({ msg: "Hemos enviaro un email con las instrucciones" })

    } catch (err) {
        console.error(err)
    }
}

const verifyPassowrdResetToken = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ token })

    if(!user) {
        const error = new Error('Hubo un error, token no válido')
        return res.status(401).json({ msg: error.message })
    }

    res.json({
        msg: 'Token valido'
    })
}
const upadtePassword = async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const user = await User.findOne({ token })

    if(!user) {
        const error = new Error('Hubo un error, token no válido')
        return res.status(401).json({ msg: error.message })
    }

    try {
        user.token = null
        user.password = password
        user.save()

        return res.status(200).json({ msg: "Contraseña modificada correctamente" })

    } catch (err) {
        console.error(err)
    }
}

export {
    register,
    verifyAccount,
    login,
    user,
    admin,
    forgotPassword,
    verifyPassowrdResetToken,
    upadtePassword
}