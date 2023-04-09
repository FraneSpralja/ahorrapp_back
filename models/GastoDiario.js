import mongoose from "mongoose";

const gastoDiarioSchema = mongoose.Schema({
        nombre: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        monto: {
            type: String,
            required: true
        },
        etiqueta: {
            type: String,
            required: true,
        },
        fecha: {
            type: Date,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

const GastoDiario = mongoose.model('GastoDiario', gastoDiarioSchema);

export default GastoDiario;