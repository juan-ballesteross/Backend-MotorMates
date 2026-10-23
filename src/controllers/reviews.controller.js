import { literal } from "sequelize";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Like from "../models/Like.js";

// El número de likes no se guarda en la tabla reviews: se cuenta en la misma
// consulta con un subquery sobre likes. Así el contador siempre coincide con
// los likes que realmente existen (no puede quedar inflado ni negativo).
const LIKES_COUNT = [
  literal('(SELECT COUNT(*)::int FROM likes WHERE likes."reviewId" = "reviews"."id")'),
  "likesCount",
];

// Todas las respuestas traen el autor (con su foto) y el vehículo, para que
// la app pinte la review sin pedir nada más, igual que con Firestore.
const REVIEW_QUERY = {
  attributes: { include: [LIKES_COUNT] },
  include: [
    { model: User, as: "user", attributes: ["id", "fullName", "avatarUrl"] },
    { model: Vehicle, as: "vehicle", attributes: ["id", "brand", "model"] },
  ],
  order: [["createdAt", "DESC"]],
};

function findReviews(where) {
  return Review.findAll({ ...REVIEW_QUERY, where });
}

async function findReview(id) {
  const [review] = await findReviews({ id });
  return review;
}

function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 0 && rating <= 5;
}

const createReview = async (req, res) => {
  try {
    const { userId, vehicleId, rating, comment } = req.body;

    if (rating === undefined || rating === null) {
      return res.status(400).json({ error: "El rating es obligatorio" });
    }
    if (!isValidRating(rating)) {
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
    res.status(201).json(await findReview(newReview.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByVehicle = async (req, res) => {
  try {
    res.json(await findReviews({ vehicleId: req.params.id }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByUser = async (req, res) => {
  try {
    res.json(await findReviews({ userId: req.params.id }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /reviews?userIds=a,b,c -> reviews de esos usuarios (feed "Siguiendo").
const getReviewsByUsers = async (req, res) => {
  try {
    const userIds = String(req.query.userIds ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (userIds.length === 0) return res.json([]);

    res.json(await findReviews({ userId: userIds }));
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
      if (!isValidRating(rating)) {
        return res.status(400).json({ error: "El rating debe ser un entero entre 0 y 5" });
      }
      review.rating = rating;
    }
    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();
    res.json(await findReview(review.id));
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

// POST /reviews/:id/likes { userId }. findOrCreate + la llave compuesta de
// likes: un segundo like del mismo usuario no suma nada.
const likeReview = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId es obligatorio" });
    }
    const [review, user] = await Promise.all([Review.findByPk(req.params.id), User.findByPk(userId)]);
    if (!review) {
      return res.status(404).json({ error: "Review no encontrada" });
    }
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await Like.findOrCreate({ where: { reviewId: review.id, userId } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unlikeReview = async (req, res) => {
  try {
    await Like.destroy({ where: { reviewId: req.params.id, userId: req.params.userId } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createReview,
  getReviewsByVehicle,
  getReviewsByUser,
  getReviewsByUsers,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
};
