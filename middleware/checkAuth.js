import jwt from 'jsonwebtoken';
import {User} from '../models/index.js';

const checkAuth = async (req,res,next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            const user= await User.scope('deletePassword').findByPk(decoded.id)
            req.user=user
            return next();
        } catch (error) {
            console.log(error)
            return res.status(404).json({message:'Hubo un error'})
        }
    }
    if(!token){
        return res.status(404).json({message:'Token no valido'})
    }

    //como no se sabe cual middelware sigue por eso seejecuta next
    next()
}

export default checkAuth
