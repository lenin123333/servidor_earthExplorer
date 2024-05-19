import { emailForgotPassword, emailRegister } from "../helpers/email.js";
import generateId from "../helpers/generateId.js";
import { generateJWT } from "../helpers/token.js";
import { User, Player } from "../models/index.js"
import bcrypt from "bcrypt";


const register = async (req, res) => {
    let { email } = req.body;

    const existsEmail = await User.findOne({ where: { email } });
    if (existsEmail) {
        const error = new Error('Correo ya registrado')
        return res.status(400).json({ msg: error.message })
    }
    const user = new User(req.body);
    user.token = generateId()
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
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
    const existsToken = await User.findOne({ where: { token: token.trim() } });
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
        player = await Player.create({
            userId: existsToken.id,
        })

    ])

    res.json({
        name: existsToken.name,
        email: existsToken.email,
        lives: player.lives,
        health: player.health,
        coins: player.coins,
        arrows: player.arrows,
        token: tokenJWT,
        idPlayer: existsToken.id
    })
}


const authenticate = async (req, res) => {

    const { email, password } = req.body
    //comprobar si el usaurio existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
        const error = new Error('La contraseña o el Correo es incorrecto')
        return res.status(400).json({ msg: error.message })
    }
    //comprobar si el user esta confirmado
    if (!user.confirmed) {
        const error = new Error('Usuario no esta confirmado')
        return res.status(400).json({ msg: error.message })
    }
    //Obtener Player

    //confirmar su contraseña
    if (await user.checkPassword(password)) {
        const player = await Player.findOne({ where: { userId: user.id } })

        res.json({
            name: user.name,
            email: user.email,
            lives: player.lives,
            health: player.health,
            coins: player.coins,
            arrows: player.arrows,
            token: generateJWT({
                id: user.id,
            }),
            idPlayer: user.id
        })
    } else {
        const error = new Error('La contraseña o el correo es incorrecto')
        return res.status(400).json({ msg: error.message })
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

const loginGoogle = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ where: { email } });

    if (user) {
        const player = await Player.findOne({ where: { userId: user.id } })

        return res.json({
            name: user.name,
            email: user.email,
            lives: player.lives,
            health: player.health,
            coins: player.coins,
            arrows: player.arrows,
            token: generateJWT({
                id: user.id
            }),
            idPlayer: user.id,
            isGuest: user.isGuest
        })
    }
    if (!user) {
        const user = new User(req.body);
        user.confirmed = 1;
        user.token = "";
        user.password = ''
        const response = await user.save();
        const player = await Player.create({
            userId: response.id,
        })
        return res.json({
            name: user.name,
            email: user.email,
            lives: player.lives,
            health: player.health,
            coins: player.coins,
            arrows: player.arrows,
            token: generateJWT({
                id: user.id,
            }),
            idPlayer: user.id
        })
    }

}

const loginGuest = async (req, res) => {
    const user = new User({ isGuest: true })

    try {
        await user.save()
        const player = await Player.create({
            userId: user.id,
        })

        return res.json({
            lives: player.lives,
            health: player.health,
            coins: player.coins,
            arrows: player.arrows,
            token: generateJWT({
                id: user.id,
            }),
            idPlayer: user.id,
            isGuest: user.isGuest
        })
    } catch (error) {
        console.log(error)
    }
}

const gestRegister = async (req, res) => {
    const { id, email, name } = req.body
    const user = await User.findOne({ where: { id } });
    if (!user) {
        const error = new Error('Usuario no Encontrado')
        return res.status(404).json({ msg: error.message })
    }
    const existeEmail = await User.findOne({ where: { email } });
    if (existeEmail) {
        const player = await Player.findOne({ where: { userId: existeEmail.id } })

        return res.json({
            lives: player.lives,
            health: player.health,
            coins: player.coins,
            arrows: player.arrows,
            token: generateJWT({
                id: existeEmail.id,
            }),
            idPlayer: existeEmail.id,
            isGuest: existeEmail.isGuest
        })
    }

    if (user.isGuest) {
        user.name = name
        user.email = email
        user.isGuest = 0
        await user.save()
        const playerNew = await Player.findOne({ where: { userId: user.id } })

        return res.json({
            lives: playerNew.lives,
            health: playerNew.health,
            coins: playerNew.coins,
            arrows: playerNew.arrows,
            token: generateJWT({
                id: user.id,
            }),
            idPlayer: user.id,
            isGuest: user.isGuest
        })

    }




}

export {
    register,
    confirm,
    authenticate,
    forgotPassword,
    newPassword,
    verifyToken,
    loginGoogle,
    loginGuest,
    gestRegister
}