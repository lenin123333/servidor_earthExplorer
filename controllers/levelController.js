import { Levels } from "../models/index.js";
import { Sequelize } from "sequelize";



const getLevels = async (req,res) =>{
    
    const {id:userId} = req.user
    const levels = await Levels.findAll({
        attributes: [
          'numLevel',
          [Sequelize.fn('MAX', Sequelize.col('numStarts')), 'maxNumStarts'],
        ],
        where: { userId },
        order: [['numLevel', 'ASC']],
        group: ['numLevel']
      });
      
      if(!levels){
        return res.json({})
      }else{
        return res.json(levels)
      }
      
   
}

const addLevel = async (req,res) => {
    const{numLevel,numStarts,nameTema,noIntentos,timeLevel} = req.body
    const {id:userId} = req.user
   
    
    const existNivel= await Levels.findOne({ where: { userId,numLevel },order: [['timeLevel', 'ASC']], });
   
    if(!existNivel){
        const dataLevel={
            numLevel,
            numStarts,
            nameTema,
            noIntentos,
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
        nameTema,
        noIntentos,
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
    addLevel,
    getLevels
}