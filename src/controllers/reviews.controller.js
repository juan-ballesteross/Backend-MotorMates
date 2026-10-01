import Review from "../models/Review.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

const createReview = async (req, res) => {
  try {
    const { userId, vehicleId, rating, comment } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    const newReview = await Review.create({ userId, vehicleId, rating, comment });
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.findAll({
      where: { vehicleId: id },
      include: { model: User, as: "user", attributes: ["id", "fullName"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.findAll({
      where: { userId: id },
      include: { model: Vehicle, as: "vehicle", attributes: ["id", "brand", "model"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: "Review no encontrada" });
    }

    await review.update(req.body);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: "Review no encontrada" });
    }

    await review.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createReview, getReviewsByVehicle, getReviewsByUser, updateReview, deleteReview };