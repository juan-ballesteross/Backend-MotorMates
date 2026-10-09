import { fn, col } from "sequelize";
import Vehicle from "../models/Vehicle.js";
import Review from "../models/Review.js";

// La calificación y el número de reseñas no se guardan en la tabla vehicles:
// se calculan desde reviews en cada consulta, así una review nueva o borrada
// se refleja de inmediato sin quedar desincronizada.
async function getReviewStats(vehicleId) {
  return Review.findAll({
    attributes: [
      "vehicleId",
      [fn("AVG", col("rating")), "promedio"],
      [fn("COUNT", col("id")), "total"],
    ],
    ...(vehicleId ? { where: { vehicleId } } : {}),
    group: ["vehicleId"],
    raw: true,
  });
}

// Postgres devuelve AVG como numeric y COUNT como bigint, y el driver pg los
// entrega como string ("4.5", "2"). Hay que convertirlos a número o el JSON
// sale con comillas y el Float/Int de CarDetailUi no lo puede parsear.
function toVehicleResponse(vehicle, stat) {
  return {
    ...vehicle.toJSON(),
    calificacion: stat ? Math.round(Number(stat.promedio) * 10) / 10 : 0,
    numeroResenas: stat ? Number(stat.total) : 0,
  };
}

const getVehicles = async (req, res) => {
  try {
    // Una sola consulta agrupada para todas las estadísticas: así no se hace
    // una consulta por vehículo.
    const [vehicles, stats] = await Promise.all([Vehicle.findAll(), getReviewStats()]);
    const statsByVehicle = new Map(stats.map((stat) => [stat.vehicleId, stat]));

    res.json(vehicles.map((vehicle) => toVehicleResponse(vehicle, statsByVehicle.get(vehicle.id))));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    const [stat] = await getReviewStats(vehicle.id);
    res.json(toVehicleResponse(vehicle, stat));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getVehicles, getVehicleById };
