import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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
        subject: 'Recupera tu password',
        text: 'Recupera tu password',
        html: 
            `
                <p>Hola <strong>${nombre}</strong>,</p>
                <p>Haz solicitado restablecer tu password, haz click en link y escribe tu nueva password:</p>
                <br>
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password.</a>
                <p>Si no has solictado cambio de password, puedes ignorar este mensaje.</p>
            `
    });

    console.log("mensaje enviado: %s", info.messageId)
};

export default emailOlvidePassword;