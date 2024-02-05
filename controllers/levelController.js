import { Levels } from "../models/index.js";

const addLevel = async (req,res) => {
    const{numLevel,numStarts,timeLevel} = req.body
    const {id:userId} = req.user
   
    
    const existNivel= await Levels.findOne({ where: { userId,numLevel },order: [['timeLevel', 'ASC']], });
   
    if(!existNivel){
        const dataLevel={
            numLevel,
            numStarts,
            timeLevel,
            userId
        }
        const level = new Levels(dataLevel)
        level.save()
        
        return res.json(level)
    }

    if(existNivel.userId !== req.user.id) {
        const error = new Error('Accion no valida')
        return res.status(400).json({ msg: error.message })
    }

    const dataLevel={
        numLevel,
        numStarts,
        timeLevel,
        userId
    }
    const level = new Levels(dataLevel)
    level.save()
    if(existNivel.timeLevel < timeLevel){

        res.json(existNivel)
    }else{
        res.json(level)
    }
   
    
    
}


export {
    addLevel
}