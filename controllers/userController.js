import { emailForgotPassword, emailRegister } from "../helpers/email.js";
import generateId from "../helpers/generateId.js";
import { generateJWT } from "../helpers/token.js";
import { User, Player } from "../models/index.js"
import bcrypt from "bcrypt";


const register = async (req, res) => {
    let { email, nameUser } = req.body;
  

    const existsEmail = await User.findOne({ where: { email } });
    if (existsEmail) {
        const error = new Error('Correo ya registrado')
        return res.status(400).json({ msg: error.message })
    }
    const existsUser = await User.findOne({ where: { nameUser } });
    if (existsUser) {
        const error = new Error('Nombre de Usuario ya Registrado,Elige otro Nombre')
        return res.status(400).json({ msg: error.message })
    }
    const user = new User(req.body);
    user.token = generateId()
    await user.save();
    //Enviar Email de confirmacion
    emailRegister({
        name: user.name,
        email,
        token: user.token
    })

    res.json({ msg: "Usuario Creado Correctamente, Revisa tu correo para obtener el codigo de activacion" })



}

const confirm = async (req, res) => {
    const { token } = req.body;
    console.log(token.trim())
    const existsToken = await User.findOne({ where: { token:token.trim() } });
    if (!existsToken) {
        const error = new Error('El Token no es valido')
        return res.status(400).json({ msg: error.message })
    }

    existsToken.token = "";
    existsToken.confirmed = 1;

    const tokenJWT = generateJWT({
        id: existsToken.id,
    })
    let player;
    await Promise.allSettled([
        await existsToken.save(),
        player= await Player.create({
            userId: existsToken.id,
        })

    ])

    res.json({
        name: existsToken.name,
        nameUser: existsToken.nameUser,
        email: existsToken.email,
        lives: player.lives,
        health: player.health,
        coins: player.coins,
        arrows: player.arrows,
        token: tokenJWT
    })
}


const authenticate = async (req, res) => {

    const idToken = req.body.idToken;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // El ID de Google es válido, puedes acceder a la información del usuario a través de decodedToken
      res.status(200).send("El ID de Google es válido");
    } catch (error) {
      // Si hay un error al verificar el token, el ID de Google no es válido
      console.error("Error al verificar el ID de Google:", error);
      res.status(401).send("El ID de Google no es válido");
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Usuario no esta registrado')
        return res.status(400).json({ msg: error.message })
    }
    if (!user.confirmed) {
        const error = new Error('Usuario no esta confirmado')
        return res.status(400).json({ msg: error.message })
    }
    try {
        user.token = generateId();
        await user.save()
        //enviar email
        emailForgotPassword({
            name: user.name,
            email: user.email,
            token: user.token
        })
        res.json({ msg: 'Hemos enviado un email con el codigo ' })

    } catch (error) {
        console.log(error)
    }

}

const verifyToken = async (req, res) => {
    const { token } = req.body
    const user = await User.findOne({ where: { token } })
    if (user) {
        return res.json({ msg: 'Token Valido' })
    } else {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message })
    }

}

const newPassword = async (req, res) => {
    const { token, password } = req.body
    const user = await User.findOne({ where: { token } })
    if (user) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.token = ''
        try {
            await user.save()
            res.json({ msg: 'Contraseña modificada Correctamente' })
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message })
    }

}



export {
    register,
    confirm,
    authenticate,
    forgotPassword,
    newPassword,
    verifyToken,
}