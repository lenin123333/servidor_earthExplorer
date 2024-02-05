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
    nameUser: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,

}, {
    hooks: {
        beforeCreate: async function (user) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
        }
    },
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