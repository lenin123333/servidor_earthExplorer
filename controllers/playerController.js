import {Player} from "../models/index.js"

const updatePlayer = async (req,res) => {
    const {id:userId} = req.body
    const player = await Player.scope('deleteInfo').findOne( {where: { userId }})

    if(!player){
        const error = new Error('El Jugador no existe')
        return res.status(400).json({ msg: error.message })
    }
    if(player.userId.toString() !== req.user.id.toString()){
        const error = new Error('Accion no valida')
        return res.status(400).json({ msg: error.message })
    }

    player.lives=req.body.lives || player.lives
    player.health=req.body.health || player.health
    player.coins=req.body.coins || player.coins
    player.arrows=req.body.arrows || player.arrows

    
    res.json(player)
}


export {
    updatePlayer
}