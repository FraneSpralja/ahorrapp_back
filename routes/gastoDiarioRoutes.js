import express from 'express';

import { 
    agregarGasto,
    obtenerGastos,
    obtenerGasto,
    actualizarGasto,
    eliminarGasto
} from '../controllers/gastoDiarioControllers.js';
import checkAuth from "../middleware/authMiddleware.js"

const router = express.Router();

// Toas las rutas son privadas y necesitan auth

router.route('/')
    .post(checkAuth, agregarGasto)
    .get(checkAuth, obtenerGastos);

router
    .route('/:id')
    .get(checkAuth, obtenerGasto)
    .put(checkAuth, actualizarGasto)
    .delete(checkAuth, eliminarGasto)
export default router;