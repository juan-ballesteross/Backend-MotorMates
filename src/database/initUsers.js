import User from "../models/User.js";

const initialUsers = [
  { fullName: "Rodrigo Salinas", email: "rodrigo@motormates.com" },
  { fullName: "Sofía Reyes", email: "sofia@motormates.com" },
  { fullName: "Iván Pérez", email: "ivan@motormates.com" },
];

async function loadInitialUsers() {
  try {
    const count = await User.count();
    if (count === 0) {
      await User.bulkCreate(initialUsers);
      console.log("Usuarios iniciales cargados");
    } else {
      console.log("Ya hay usuarios en la base de datos");
    }
  } catch (error) {
    console.log(error);
  }
}

export { loadInitialUsers };