import express from 'express';
import dotenv from 'dotenv'
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import playerRoutes from './routes/playerRoutes.js'
import levelRoutes from './routes/levelRoutes.js'
import InventaryRoutes from './routes/inventaryRoutes.js';
import cors  from 'cors';
const app = express();
app.use(express.json());

dotenv.config();

// Configurar CORS para permitir cualquier origen
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));

//conexion a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion exitosa a la base de datos');
} catch (error) {
    console.log(error);
}


app.use("/api/users",userRoutes)
app.use("/api/player",playerRoutes)
app.use("/api/level",levelRoutes)
app.use("/api/inventary",InventaryRoutes)

//Routing
const PORT = process.env.PORT || 4000
const servidor = app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})

