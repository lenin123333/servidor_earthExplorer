import db from "../config/db.js";
import { Item } from "../models/index.js";
import items from "./items.js";
import {exit} from "node:process"

const importData = async ()=>{
    try {
        //Autenticar en la base de datos
        await db.authenticate()
        //generar columnas de la base datos
        await db.sync()
        //insertar datos
        
        await Promise.all([
            Item.bulkCreate(items)
        ])
        //exit en 0 o nada signifca que si terminar la ejecución fue correcto
        // con 1 es porque hay un error
        exit()

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


const deleteData= async () => {
    try {
      //  await Promise.all([
        //    Categoria.destroy({where:{},truncate:true}),
          //  Precio.destroy({where:{},truncate:true})
            
        //])
        //otra forma
        await db.sync({force:true})
        exit()
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


if(process.argv[2]==="-i"){
    importData()
}

if(process.argv[2]==="-e"){
    deleteData()
}