import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import conectarDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import gastoDiarioRoutes from "./routes/gastoDiarioRoutes.js"

const app = express();
app.use(express.json());
dotenv.config()

conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del request está permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/user', userRoutes)
app.use('/api/gasto-diario', gastoDiarioRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(` servidor funcionando en puerto ${PORT}`)
})