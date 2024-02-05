import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Inventary = db.define('Inventary', {
    id: {
        //genera un id como en mongo con numeros grandes
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    numItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    scopes: {
        deleteInfo: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    }
}
);

export default Inventary;