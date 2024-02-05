import { Inventary, Item } from "../models/index.js"


const addInventory = async (req,res) => {
    const userId= req.user.id
    
    const existInventary = await Inventary.scope('deleteInfo').findAll({where:{userId}})
    
    
    if(existInventary.length > 0) {
        const inventary = await Inventary.bulkCreate(req.body, {
            updateOnDuplicate: ['numItems'], // Campos que deseas actualizar en caso de duplicados
          })
        res.json(inventary)
    }else{
        const inventary = await Inventary.bulkCreate(req.body)
        res.json(inventary)
    }
    
}



const showinventary = async (req, res) => {
    const userId= req.user.id
    
    const existInventary = await Inventary.scope('deleteInfo').findAll({
        where: { userId },
        include: [{ model: Item, as: 'item' }],
      });
      
    
    res.json(existInventary)
   
}




export {
    addInventory,
    showinventary
}