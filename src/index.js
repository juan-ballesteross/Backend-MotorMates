import app from "./app.js";
import { sequelize } from "./database/database.js";
import { setupRelations } from "./database/relations.js";
import { loadInitialUsers } from "./database/initUsers.js";
import { loadInitialVehicles } from "./database/initVehicles.js";

// Importar los modelos para que Sequelize sepa que debe crear sus tablas.
import "./models/User.js";
import "./models/Vehicle.js";
import "./models/Review.js";

async function init() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito");

    // force: true borra y vuelve a crear las tablas en cada inicio —
    // útil ahora en desarrollo, pero se quitaría en producción.
    await sequelize.sync({ force: true });

    // Muy importante el orden: primero las relaciones, luego los datos.
    setupRelations();

    await loadInitialUsers();
    await loadInitialVehicles();

    app.listen(3000, () => {
      console.log("Servidor corriendo en el puerto 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

init();