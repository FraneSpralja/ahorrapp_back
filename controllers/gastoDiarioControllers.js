import GastoDiario from "../models/GastoDiario.js"

// Agregar gasto diarios

const agregarGasto = async (req, res) => {
    const gasto = new GastoDiario(req.body);
    console.log(req.user)
    gasto.user = req.user._id;
    try {
        const gastoGuardado = await gasto.save();
        res.json({gastoGuardado});
    } catch (error) {
        console.log(error)
    } 
}

// Obtener todos los gatos de un user

const obtenerGastos = async (req, res) => {
    const gastos = await GastoDiario.find().where("user").equals(req.user);

    res.json({gastos})
}

// Obtener un gasto por id de gasto

const obtenerGasto = async (req, res) => {
    const { id } = req.params;

    const gasto  = await GastoDiario.findById(id);

    if(!gasto) {
        return res.status(404).json({msg: "Gasto no encontrado"})
    }

    if(gasto.user.toString() !== req.user._id.toString()) {
        return res.json({msg:'Acción no es válida'})
    }

    if(gasto) res.json({gasto})

}

// Actualizar información de gasto
const actualizarGasto = async (req, res) => {
    const { id } = req.params;

    const gasto  = await GastoDiario.findById(id);

    if(!gasto) {
        return res.status(404).json({msg: "Gasto no encontrado"})
    }

    if(gasto.user.toString() !== req.user._id.toString()) {
        return res.json({msg:'Acción no es válida'})
    }

    gasto.nombre = req.body.nombre || gasto.nombre;
    gasto.monto = req.body.monto || gasto.monto;
    gasto.fecha = req.body.fecha || gasto.fecha;
    gasto.tipo = req.body.tipo || gasto.tipo;

    try {
        const gastoActualizado = await gasto.save();
        res.json(gastoActualizado);
    } catch (error) {
        console.log(error)
    }
}

// Eliminar gastos
const eliminarGasto = async (req, res) => {
    const { id } = req.params;

    const gasto  = await GastoDiario.findById(id);

    if(!gasto) {
        return res.status(404).json({msg: "Gasto no encontrado"})
    }

    if(gasto.user.toString() !== req.user._id.toString()) {
        return res.json({msg:'Acción no es válida'})
    }

    try {
        await gasto.deleteOne()
        res.json({msg: "Gasto eliminado"})
    } catch (error) {
        console.log(error)
    }
}

export {
    agregarGasto,
    obtenerGastos,
    obtenerGasto,
    actualizarGasto,
    eliminarGasto
}