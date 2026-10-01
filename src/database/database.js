import { Sequelize } from "sequelize";

//Falta que pongan los datos aca de postgres mi gente
const sequelize = new Sequelize("motormates", "postgres", "TU_CONTRASENA", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

export { sequelize };