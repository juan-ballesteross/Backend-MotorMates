import Review from "../models/Review.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

const createReview = async (req, res) => {
  try {
    const { userId, vehicleId, rating, comment } = req.body;

    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: "El rating es obligatorio" });
    }
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "El rating debe ser un entero entre 0 y 5" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    const newReview = await Review.create({ userId, vehicleId, rating, comment });
    res.status(201).json(newReview);
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

    // Solo rating y comment son editables: userId y vehicleId se fijan al crear
    // la review y no deben reasignarse, para no romper la asociación.
    const { rating, comment } = req.body;

    if (rating !== undefined) {
      if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ error: "El rating debe ser un entero entre 0 y 5" });
      }
      review.rating = rating;
    }
    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();
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