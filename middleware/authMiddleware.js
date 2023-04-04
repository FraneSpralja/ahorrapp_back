import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Confirmar JWT
const checkAuth = async (req, res, next) => {
    let token;

    // Get jwt
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Confirmar info usuario en jwt 

            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password -token -confirmado");

            return next();
        } catch (error) {

            // Error al confirmar jwt
            const err = new Error('El usuario no existe o es incorrecto');
            return res.status(403).json({ msg: err.message });
        }
    }

    // Si no existe jwt
    if(!token){
        const error = new Error('El usuario o la contraseña ingresados no son validos')
        res.status(403).json({ msg: error.message })
    }

    next()
}

export default checkAuth;