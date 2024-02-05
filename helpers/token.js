import  jwt  from "jsonwebtoken";

const generateJWT = data =>  jwt.sign({
    
    //Autenticar al usuario
        id: data.id,
    
}, process.env.JWT_SECRET,{
    expiresIn:'30d'
})

export{
    generateJWT
}