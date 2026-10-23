import User from "../models/User.js";

// Los ids imitan un uid de Firebase (texto), porque la tabla users ya no es
// autoincremental: los usuarios reales se crean con su uid al registrarse.
const initialUsers = [
  { id: "seed_user_1", fullName: "Rodrigo Salinas", email: "rodrigo@motormates.com", username: "rodrigo" },
  { id: "seed_user_2", fullName: "Sofía Reyes", email: "sofia@motormates.com", username: "sofia" },
  { id: "seed_user_3", fullName: "Iván Pérez", email: "ivan@motormates.com", username: "ivan" },
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