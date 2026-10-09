import Vehicle from "../models/Vehicle.js";

const initialVehicles = [
  {
    brand: "Porsche",
    model: "911 GT3",
    year: 2024,
    category: "Deportivo",
    imageUrl:
      "https://www.europeanprestige.co.uk/blobs/stock/577/images/45f3295c-923a-40fd-b1e7-6f6d0d129de2/hi4a4328.jpg?width=2000&height=1333",
    potencia: "502 hp",
    aceleracion: "3.4 s",
    velocidadMaxima: "318 km/h",
    traccion: "RWD",
  },
  {
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2022,
    category: "SUV",
    imageUrl: "https://autoamerica.com.co/wp-content/uploads/2020/08/4N4A2472.jpg",
    potencia: "409 hp",
    aceleracion: "6.7 s",
    velocidadMaxima: "210 km/h",
    traccion: "4x4",
  },
  {
    brand: "Ford",
    model: "Mustang '67",
    year: 1967,
    category: "Clásico",
    imageUrl:
      "https://bringatrailer.com/wp-content/uploads/2026/07/1967_ford_mustang-gt_1967_ford_mustang-gt_445183c0-f15d-4fac-bfaf-aab6c2d8d11d-uhtvDu-46102-46103-scaled.jpg?w=940",
    potencia: "320 hp",
    aceleracion: "6.5 s",
    velocidadMaxima: "195 km/h",
    traccion: "RWD",
  },
  {
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    category: "Eléctrico",
    imageUrl: "https://cdn.motor1.com/images/mgl/eoOk4M/s1/prueba-tesla-model-3-traccion-trasera.jpg",
    potencia: "283 hp",
    aceleracion: "6.1 s",
    velocidadMaxima: "201 km/h",
    traccion: "RWD",
  },
  {
    brand: "Chevrolet",
    model: "Camaro SS",
    year: 2021,
    category: "Deportivo",
    imageUrl:
      "https://cdn-fastly.autoguide.com/media/2023/06/07/12309463/2016-chevrolet-camaro-ss-review-curbed-with-craig-cole.jpg?size=720x845&nocrop=1",
    potencia: "455 hp",
    aceleracion: "4.0 s",
    velocidadMaxima: "250 km/h",
    traccion: "RWD",
  },
  {
    brand: "Jeep",
    model: "Wrangler",
    year: 2023,
    category: "SUV",
    imageUrl: "https://orangeclub.co/wp-content/uploads/2025/05/Jeep-Wrangler-Rubicon.jpg",
    potencia: "285 hp",
    aceleracion: "6.9 s",
    velocidadMaxima: "180 km/h",
    traccion: "4x4",
  },
  {
    brand: "Volkswagen",
    model: "Beetle '65",
    year: 1965,
    category: "Clásico",
    imageUrl: "https://goauctionmpc.goauction.co.uk/stock/1708-0-medium.jpg?v=63829760351190",
    potencia: "50 hp",
    aceleracion: "27.0 s",
    velocidadMaxima: "125 km/h",
    traccion: "RWD",
  },
  {
    brand: "Ford",
    model: "Ranger",
    year: 2022,
    category: "Pickup",
    imageUrl: "https://imagenes.portafolio.co/files/image_600_455/uploads/2021/01/29/6014dcacba87b.jpeg",
    potencia: "210 hp",
    aceleracion: "10.3 s",
    velocidadMaxima: "180 km/h",
    traccion: "4x4",
  },
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
