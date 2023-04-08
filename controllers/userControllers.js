import generarJWT from "../helpers/generarJWT.js";
import randomNum from "../helpers/randomNumber.js";
import User from "../models/User.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

// Registrar usuario 
const registrar = async(req, res) => {
    const { email, nombre } = req.body;

    // Buscar usuario en db
    const userExist = await User.findOne({ email });

    // Si el correo existe
    if(userExist){
        const error = new Error('El usuario no ha podido ser creado o ya existe');
        return res.status(400).json({ msg: error.message });
    }

    // Guardar usuario en db
    try {
        const user = new User(req.body);
        const userSave = await user.save();

        // Enviar correo con información de registro;
        emailRegistro({
            email,
            nombre,
            token: userSave.token
        });

        res.json(userSave);
    } catch (error) {
        console.log(error)
    }
};

// get perfil usuario ya autenticado
const perfil = (req, res) => {
    const  { user } = req;
    res.json({ user });
}

// Confirmar usaurio creado
const confirmar = async(req, res) => {

    // get token único y confirmar dentro de db
    const { token } = req.params;
    const user = await User.findOne({ token });


    // Si no existe token
    if(!user) {
        const error = new Error('Lo sentimos, el link ha caducado o ha sido confirmado');
        return res.status(404).json({ msg: error.message })
    }

    // Confirmar usuario dentro de db
    try {
        user.token = null;
        user.confirmado = true;
        user.save();

        res.json({ msg: "El usuario ha sido confirmado" })
    } catch (error) {
        console.log(error);
    }
}

// Autenticar usuario en login
const autenticar = async(req, res) => {
    // get email y password
    const  { email, password } = req.body;

    // confirmar usaurio a través de email único
    const user = await User.findOne({ email });

    // Si no existe usuario
    if(!user) {
        const error = new Error('usuario no existe');
        return res.status(403).json({ msg: error.message })
    }

    // Si usuario no ha sido confirmado
    if(!user.confirmado) {
        const error = new Error('el usuario no ha sido confirmado');
        return res.status(403).json({ msg: error.message })
    }

    // Comparar password enviada con password hasheada
    if(await user.comprobarPassword(password)) {
        // Autenticar
        res.json({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            token: generarJWT(user.id)
        })
    } else {
        const error = new Error('Usuario o contraseña son incorrectos');
        return res.status(403).json({ msg: error.message })
    }
}

const cambiarPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message })
    }

    try {        
        user.token = randomNum();
        await user.save()

        // Enviar email con instrucciones cambio de password
        emailOlvidePassword({
            email,
            nombre: user.nombre,
            token: user.token
        })

        res.json({ msg: "Hemos enviado un correo con las instrucciones" })
    } catch (error) {
        console.log(error)
    }
}

const comprobarTokenNewPassword = async (req, res) => {
    const { token } = req.params;
    
    const user = await User.findOne({ token })
    
    if(!user) {
        const error = new Error('La información enviada es incorrecta');
        return res.status(400).json({ msg: error.message });
    } else {
        res.json({ msg: "Por favor, cambia tu contraseña" })
    }
}

const nuevaPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });

    if(!user) {
        const error = new Error('La información enviada es incorrecta');
        return res.status(400).json({ msg: error.message });
    }

    try {
        
        user.token = null;
        user.confirmado = true;
        user.password = password;

        await user.save();

        res.json({ msg: "La nueva contraseña ha sido guardada correctamente" })
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req, res) => {
    // Encontrar user
    const user = await User.findById(req.params.id);

    // En caso de error
    if(!user) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    // En caso de cambair email
    const { email } = req.body;
    if(user.email !== req.body.email) {
        const existeEmail = await User.findOne({ email })
        if(existeEmail) {
            const error = new Error("Ese mail ya esta en uso");
            return res.status(400).json({ msg: error.message })
        }
    }

    // Guardar datos actualizados
    try {
        user.nombre = req.body.nombre;
        user.email = req.body.email;
        user.main_ingreso = req.body.main_ingreso;

        const userActualizado = await user.save();
        res.json(userActualizado);
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {
    // Leer datos
    const { id } = req.user;
    const { password_actual, password_nuevo } = req.body;

    // Comprobar que el user exista
    const user = await User.findById(id);
    if(!user) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    // Comprobar password
    if(await user.comprobarPassword(password_actual)) {
        // Almacenar nuevo password
        user.password = password_nuevo;
        await user.save()
        res.json({ msg: 'Password actualizado correctamente' })
    } else {
        const error = new Error('El password actual es incorrecto');
        return res.status(400).json({ msg: error.message })
    }

}

export { 
    registrar,
    perfil,
    confirmar,
    autenticar,
    cambiarPassword,
    comprobarTokenNewPassword,
    nuevaPassword,
    actualizarPerfil,
    actualizarPassword
};