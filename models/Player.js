import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Player = db.define('Player', {
    id: {
        //genera un id como en mongo con numeros grandes
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    lives: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:2
    },
    health: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:100
    },
    coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    arrows: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:10
    },

},{
    scopes: {
        deleteInfo: {
            attributes: {
                exclude: ['id','createdAt', 'updatedAt']
            }
        }
    }
}
);
export default Player;