import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

// El id es el uid de Firebase Auth (texto), no un autoincremental: así un
// mismo usuario se identifica igual en Firestore y en este backend, y la app
// puede cambiar de fuente de datos sin traducir ids.
const User = sequelize.define("users", {
  id: {
    type: DataTypes.STRING(128),
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: true,
    unique: true,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "",
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  // Las imágenes siguen en Firebase Storage: aquí solo se guarda su URL.
  avatarUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coverUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default User;
