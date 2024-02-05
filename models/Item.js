import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Item = db.define('Item', {
    nameItem: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}
);

export default Item;