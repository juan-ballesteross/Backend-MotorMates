import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

// Solo guarda ids (actor, vehículo, review), igual que en Firestore: el
// nombre del actor y los datos del vehículo se resuelven al leer.
const Notification = sequelize.define("notifications", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipientId: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  actorId: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  vehicleId: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  reviewId: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
});

export default Notification;
