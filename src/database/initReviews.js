import Review from "../models/Review.js";

// Los userId van de seed_user_1 a seed_user_3 y los vehicleId de 1 a 8 porque son los que siembran
// initUsers e initVehicles — las llaves foráneas exigen que ya existan.
// El vehículo 8 (Ford Ranger) se deja a propósito sin reviews, para comprobar
// que el detalle devuelve calificacion 0 y numeroResenas 0 en vez de null.
const initialReviews = [
  { userId: "seed_user_1", vehicleId: 1, rating: 5, comment: "El sonido del motor es otro nivel. Se siente pegado al piso en cada curva." },
  { userId: "seed_user_2", vehicleId: 1, rating: 5, comment: "Impecable en pista, pero para ciudad es incómodo y muy duro." },
  { userId: "seed_user_3", vehicleId: 1, rating: 4, comment: "Una máquina, aunque el precio del mantenimiento asusta." },

  { userId: "seed_user_1", vehicleId: 2, rating: 4, comment: "Lo saqué a trocha todo un fin de semana y no se quejó ni una vez." },
  { userId: "seed_user_3", vehicleId: 2, rating: 3, comment: "Enorme y confiable, pero el consumo de gasolina es alto." },

  { userId: "seed_user_2", vehicleId: 3, rating: 5, comment: "Un clásico que voltea cabezas donde sea. Vale cada peso de la restauración." },
  { userId: "seed_user_3", vehicleId: 3, rating: 4, comment: "Hermoso, aunque sin frenos modernos hay que manejarlo con respeto." },

  { userId: "seed_user_1", vehicleId: 4, rating: 4, comment: "El ahorro mensual se nota muchísimo. La autonomía me alcanza de sobra." },
  { userId: "seed_user_2", vehicleId: 4, rating: 3, comment: "Buen carro, pero encontrar cargador rápido en carretera todavía cuesta." },

  { userId: "seed_user_3", vehicleId: 5, rating: 4, comment: "Potencia de sobra y buen precio para lo que entrega." },

  { userId: "seed_user_1", vehicleId: 6, rating: 5, comment: "Quitarle el techo un domingo no tiene comparación. Perfecto para montaña." },
  { userId: "seed_user_2", vehicleId: 6, rating: 3, comment: "Divertidísimo fuera de la ciudad, pero en autopista suena mucho." },

  { userId: "seed_user_2", vehicleId: 7, rating: 4, comment: "Sencillo, económico y se arregla con cualquier mecánico. Un amor." },
];

async function loadInitialReviews() {
  try {
    const count = await Review.count();
    if (count === 0) {
      await Review.bulkCreate(initialReviews);
      console.log("Reviews iniciales cargadas");
    } else {
      console.log("Ya hay reviews en la base de datos");
    }
  } catch (error) {
    console.log(error);
  }
}

export { loadInitialReviews };
