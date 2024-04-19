import { Levels, User } from "../models/index.js";
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
            timeLevel,
            userId,
            nameTema,
            noIntentos,
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
        userId,
        nameTema,
        noIntentos,
    }
    const level = new Levels(dataLevel)
    level.save()
    if(existNivel.timeLevel < timeLevel){

        res.json(existNivel)
    }else{
        res.json(level)
    }
   
    
    
}

const getStatistics= async (req,res) => {
    const userId = req.params.id;
    const existUser=await User.scope('deletePassword').findByPk(userId);
    if(!existUser){
        return res.status(404).json({ message: 'El Usuario No Existe' })
    }
    const conteoNoIntentos = await Levels.findAll({
        attributes: [
          'nameTema',
          'noIntentos',
          [Sequelize.fn('COUNT', Sequelize.col('noIntentos')), 'total']
        ],
        group: ['nameTema', 'noIntentos'],
        where: {
          noIntentos: {
            [Sequelize.Op.in]: [0, 1, 2, 3] // Filtrar noIntentos igual a 0, 1, 2 y 3
          }
        }
      });
     
    const  count  = await Levels.aggregate('numLevel', 'DISTINCT', { plain: false });
    return res.json({
        conteoNoIntentos,
        total:count.length
    })
      

   

}

export {
    addLevel,
    getLevels,
    getStatistics
}