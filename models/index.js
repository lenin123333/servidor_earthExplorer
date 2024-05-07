import Player from "./Player.js";
import User from "./User.js";
import Levels from "./Levels.js";
import Inventary from "./Inventary.js";
import Item from "./Item.js";

//Precio.hasOne(Propiedad)


Player.belongsTo(User,{foreignKey:'userId'})
//Funciona de manera alrevex aqui le decimos primero quien tendra
//la relacion y despues la tabla y el nombre del campo
User.hasMany(Levels,{foreignKey:'userId'})
Levels.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Inventary,{foreignKey:'userId'})
//Relacion entre ambas tablas
// En el modelo Item
Item.hasMany(Inventary, { foreignKey: 'itemId', as: 'inventaries' });
// En el modelo Inventary
Inventary.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

export {
    Player,
    User,
    Levels,
    Inventary,
    Item
}