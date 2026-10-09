import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const Vehicle = sequelize.define("vehicles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  // Imagen como URL (String), no como recurso local — mismo criterio del Sprint 7.
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Especificaciones técnicas que la app muestra en el detalle del vehículo.
  // Se guardan como texto porque llegan ya formateadas con su unidad ("502 hp"),
  // tal como las espera CarDetailUi.
  potencia: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  aceleracion: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  velocidadMaxima: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  traccion: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
});

export default Vehicle;
