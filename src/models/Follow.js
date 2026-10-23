import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

// Mismo criterio que Like: la llave compuesta impide seguir dos veces a la
// misma persona, así los contadores (que se calculan con COUNT) cuadran.
const Follow = sequelize.define("follows", {
  followerId: {
    type: DataTypes.STRING(128),
    primaryKey: true,
  },
  followingId: {
    type: DataTypes.STRING(128),
    primaryKey: true,
  },
});

export default Follow;
