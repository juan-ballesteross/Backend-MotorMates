import Vehicle from "../models/Vehicle.js";

const initialVehicles = [
  { brand: "Porsche", model: "911 GT3", year: 2024, category: "Deportivo", imageUrl: null },
  { brand: "Toyota", model: "Land Cruiser", year: 2022, category: "SUV", imageUrl: null },
  { brand: "Ford", model: "Mustang '67", year: 1967, category: "Clásico", imageUrl: null },
  { brand: "Tesla", model: "Model 3", year: 2024, category: "Eléctrico", imageUrl: null },
  { brand: "Chevrolet", model: "Camaro SS", year: 2021, category: "Deportivo", imageUrl: null },
  { brand: "Jeep", model: "Wrangler", year: 2023, category: "SUV", imageUrl: null },
  { brand: "Volkswagen", model: "Beetle '65", year: 1965, category: "Clásico", imageUrl: null },
  { brand: "Ford", model: "Ranger", year: 2022, category: "Pickup", imageUrl: null },
];

async function loadInitialVehicles() {
  try {
    const count = await Vehicle.count();
    if (count === 0) {
      await Vehicle.bulkCreate(initialVehicles);
      console.log("Vehículos iniciales cargados");
    } else {
      console.log("Ya hay vehículos en la base de datos");
    }
  } catch (error) {
    console.log(error);
  }
}

export { loadInitialVehicles };