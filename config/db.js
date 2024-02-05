import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: '.env' })

const db = new Sequelize(
    process.env.DB_NOMBRE,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    //Sirve para configurar las conexiones nuevas o consistentes, en caso de que halla una conexion
    // se utilce y no cree una nueva en maximo 5 por cada usuario
    // 30 segundos antes de mandar error que no puedo conectar
    // 10 segundos verifica que no hay movimientos para finalizar la conexion para liberar memoria
    pool: {
        max: 20,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});

export default db