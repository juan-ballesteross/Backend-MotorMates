import { fn, col, Op } from "sequelize";
import { sequelize } from "../database/database.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Like from "../models/Like.js";

// Los contadores de seguidores no se guardan en la tabla users: se calculan
// con COUNT sobre follows en cada respuesta. Así nunca se desincronizan,
// pase lo que pase con los follows (es la versión en servidor de lo que en
// Firestore hace la transacción de follow).
async function countFollows(userIds) {
  if (userIds.length === 0) return { followers: new Map(), following: new Map() };
  const [followers, following] = await Promise.all([
    Follow.findAll({
      attributes: ["followingId", [fn("COUNT", col("followerId")), "total"]],
      where: { followingId: userIds },
      group: ["followingId"],
      raw: true,
    }),
    Follow.findAll({
      attributes: ["followerId", [fn("COUNT", col("followingId")), "total"]],
      where: { followerId: userIds },
      group: ["followerId"],
      raw: true,
    }),
  ]);
  return {
    followers: new Map(followers.map((row) => [row.followingId, Number(row.total)])),
    following: new Map(following.map((row) => [row.followerId, Number(row.total)])),
  };
}

// Misma forma que el UserDto de la app: createdAt en milisegundos (Long) y
// los contadores ya calculados.
async function toUserResponses(users) {
  const counts = await countFollows(users.map((user) => user.id));
  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username ?? "",
    location: user.location ?? "",
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    followersCount: counts.followers.get(user.id) ?? 0,
    followingCount: counts.following.get(user.id) ?? 0,
    createdAt: new Date(user.createdAt).getTime(),
  }));
}

async function toUserResponse(user) {
  const [response] = await toUserResponses([user]);
  return response;
}

function isUniqueViolation(error) {
  return error.name === "SequelizeUniqueConstraintError";
}

const createUser = async (req, res) => {
  try {
    const { id, fullName, email, username } = req.body;
    if (!id || !fullName || !email) {
      return res.status(400).json({ error: "id, fullName y email son obligatorios" });
    }
    // El username inicial sale del correo (lo que va antes de la @), así que
    // dos correos como juan@gmail y juan@hotmail chocarían. En ese caso se le
    // agrega un sufijo del uid en vez de rechazar el registro; el usuario lo
    // puede cambiar después desde "Editar perfil".
    let initialUsername = username || null;
    if (initialUsername && (await User.findOne({ where: { username: initialUsername } }))) {
      initialUsername = `${initialUsername}_${id.slice(0, 4).toLowerCase()}`;
    }
    const user = await User.create({ id, fullName, email, username: initialUsername });
    res.status(201).json(await toUserResponse(user));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return res.status(409).json({ error: "Ya existe un usuario con ese correo o username" });
    }
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.findAll({
      ...(username ? { where: { username } } : {}),
      order: [["fullName", "ASC"]],
    });
    res.json(await toUserResponses(users));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(await toUserResponse(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualización parcial: solo se tocan los campos que vengan en el body.
const EDITABLE_FIELDS = ["fullName", "username", "location", "bio", "avatarUrl", "coverUrl"];

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    }
    if (!user.fullName || !user.fullName.trim()) {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }
    await user.save();
    res.json(await toUserResponse(user));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return res.status(409).json({ error: "Ese nombre de usuario ya está en uso" });
    }
    res.status(500).json({ error: error.message });
  }
};

// POST /users/:id/followers { followerId }: followerId empieza a seguir a :id.
// findOrCreate dentro de una transacción: si ya lo seguía no pasa nada.
const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const { followerId } = req.body;
    if (!followerId) {
      return res.status(400).json({ error: "followerId es obligatorio" });
    }
    if (followerId === targetId) {
      return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }
    const [target, follower] = await Promise.all([User.findByPk(targetId), User.findByPk(followerId)]);
    if (!target || !follower) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await sequelize.transaction((transaction) =>
      Follow.findOrCreate({ where: { followerId, followingId: targetId }, transaction })
    );
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    await Follow.destroy({ where: { followerId: req.params.followerId, followingId: req.params.id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 200 si followerId sigue a :id, 404 si no.
const isFollowing = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      where: { followerId: req.params.followerId, followingId: req.params.id },
    });
    if (!follow) {
      return res.status(404).json({ error: "No lo sigue" });
    }
    res.json({ following: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const links = await Follow.findAll({ where: { followingId: req.params.id }, raw: true });
    const users = await User.findAll({ where: { id: links.map((link) => link.followerId) } });
    res.json(await toUserResponses(users));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const links = await Follow.findAll({ where: { followerId: req.params.id }, raw: true });
    const users = await User.findAll({ where: { id: links.map((link) => link.followingId) } });
    res.json(await toUserResponses(users));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:id/likes?reviewIds=1,2,3 -> ids (como texto) de las reviews de
// esa lista a las que el usuario ya les dio like.
const getLikedReviewIds = async (req, res) => {
  try {
    const reviewIds = String(req.query.reviewIds ?? "")
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);
    if (reviewIds.length === 0) return res.json([]);

    const likes = await Like.findAll({
      where: { userId: req.params.id, reviewId: { [Op.in]: reviewIds } },
      raw: true,
    });
    res.json(likes.map((like) => String(like.reviewId)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  getLikedReviewIds,
};
