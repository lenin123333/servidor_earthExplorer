import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const User = db.define('Users', {
    id: {
        //genera un id como en mongo con numeros grandes
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isGuest:{
        type:DataTypes.BOOLEAN,
        defaultValue:0
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,

}, {
    scopes: {
        deletePassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmed', 'createdAt', 'updatedAt']
            }
        }
    }
});

// Métodos personalizados
User.prototype.checkPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};
export default User;