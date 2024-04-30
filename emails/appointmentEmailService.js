import { createTransport } from '../config/nodemailer.js';

export async function sendEmailNewAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
      );

    // Enviar email
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com', // TODO: Make a table with admins
        subject: 'AppSalon - Cita nueva',
        text: 'AppSalon - Hola Admin, tienes una nueva cita',
        html: `<h4>¡Hola Admin tienes una nueva cita agendada.</h4>
        <p>La cita será el día ${date} a las ${time} horas.</p>`
    })

    console.log(info.messageId)
}

export async function sendEmailUpdateAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
      );

    // Enviar email
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com', // TODO: Make a table with admins
        subject: 'AppSalon - Cita actualizada',
        text: 'AppSalon - Hola Admin, tienes cambios en una cita',
        html: `<h4>¡Hola Admin Un usario ha realizado cambios en su cita.</h4>
        <p>La nueva cita será el día ${date} a las ${time} horas.</p>`
    })

    console.log(info.messageId)
}

export async function sendEmailDeleteAppointment({ date, time }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
      );

    // Enviar email
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com', // TODO: Make a table with admins
        subject: 'AppSalon - Cita cancelada',
        text: 'AppSalon - Hola Admin, se ha cancelado la cita',
        html: `<h4>¡Hola Admin Un usario ha realizado cambios en su cita.</h4>
        <p>La cita del día ${date} a las ${time} horas. ha sido cancelada por el usuario</p>`
    })

    console.log(info.messageId)
}