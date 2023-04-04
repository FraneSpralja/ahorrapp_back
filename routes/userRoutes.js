import express from "express";

import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    cambiarPassword,
    comprobarTokenNewPassword,
    nuevaPassword,
    actualizarPerfil,
    actualizarPassword
} from "../controllers/userControllers.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/cambiar-password', cambiarPassword);
router.route('/cambiar-password/:token').get(comprobarTokenNewPassword).post(nuevaPassword);

// Rutas privadas usuario
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;