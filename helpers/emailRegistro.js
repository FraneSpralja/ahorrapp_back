import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // Enviar email
    const { email, nombre, token } = datos;

    const info = await transporter.sendMail({
        from: "Adminstrador Ahorrap",
        to: email,
        subject: 'Activa tu cuenta en Ahorrapp',
        text: 'Comprueba tu cuenta en Ahorrapp',
        html: 
            `
                <p>Hola <strong>${nombre}</strong>,</p>
                <p>Tu cuenta esta lista, solo debes comprobarla en el siguiente enlace:</p>
                <br>
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirma tu cuenta.</a>
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
            `
    });

    console.log("mensaje enviado: %s", info.messageId)
};

export default emailRegistro;