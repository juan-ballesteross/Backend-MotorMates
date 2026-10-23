import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

// La llave primaria compuesta (reviewId, userId) hace que la base de datos
// rechace un segundo like del mismo usuario a la misma review: el contador
// de likes nunca puede quedar inflado por un doble toque.
const Like = sequelize.define("likes", {
  reviewId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING(128),
    primaryKey: true,
  },
});

export default Like;
