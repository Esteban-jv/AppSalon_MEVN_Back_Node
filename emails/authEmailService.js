import { createTransport } from '../config/nodemailer.js';

export async function sendEmailVerification({ name, email, token }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
      );

    // Enviar email
    const info = await transporter.sendMail({
        from: 'AppSalon <cuentas@appsalon.com>',
        to: email,
        subject: 'AppSalon - Confirma tu cuenta',
        text: 'AppSalon - Confirma tu cuenta',
        html: `<h4>¡Hola ${name}! Confirma tu cuenta en AppSalon.</h4>
        <p>Tu cuenta está casi lista, solo debes confirmarla haciendo click en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta </a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    })

    console.log(info.messageId)
}

export async function sendEmailPasswordReset({ name, email, token }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
      );

    // Enviar email
    const info = await transporter.sendMail({
        from: 'AppSalon <cuentas@appsalon.com>',
        to: email,
        subject: 'AppSalon - Reestablece tu contraseña',
        text: 'AppSalon - Reestablecer tu contraseña',
        html: `<h4>¡Hola ${name} Hemos recibido una solicitud de cambio de contraseña.</h4>
        <p>Sigue el siguiente enlace para generar un nuevo password:</p>
        <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Reestablecer contraseña</a>
        <p>Si tu no solicitaste reestablecer tu contraseña, puedes ignorar este mensaje.</p>`
    })

    console.log(info.messageId)
}