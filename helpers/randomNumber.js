// Genrar token único para confirmar usuario y cambio de contraseña

const randomNum = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}

export default randomNum;