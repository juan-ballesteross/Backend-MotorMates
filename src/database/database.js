import { Sequelize } from "sequelize";

const sequelize = new Sequelize("motormates", "postgres", "password", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

export { sequelize };