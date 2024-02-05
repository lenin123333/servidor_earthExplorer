import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Levels = db.define('Levels', {
    id: {
        //genera un id como en mongo con numeros grandes
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    numLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numStarts: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timeLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}
);

export default Levels;