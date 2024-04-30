import nodemailer from 'nodemailer'

export function createTransport(host, port, user, pass) {
    return nodemailer.createTransport({
        host,
        port,
        // secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user,
          pass
        },
    });
}