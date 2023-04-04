import mongoose from "mongoose";
import bcrypt from "bcrypt";
import randomNum from "../helpers/randomNumber.js";

// Definir modelo de usuario
const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    main_ingreso: {
        type: String,
        default: null,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: randomNum()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Hashear contraseña antes de gaurdar o en caso de ser modificada
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Comparar contraseña hasheada con contraseña de login
userSchema.methods.comprobarPassword = async function(passwordLogin) {
    return await bcrypt.compare(passwordLogin, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;