import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Misma forma que el NotificationDto de la app: createdAt en milisegundos.
function toNotificationResponse(notification) {
  return {
    id: String(notification.id),
    type: notification.type,
    actorId: notification.actorId,
    vehicleId: notification.vehicleId,
    reviewId: notification.reviewId,
    createdAt: new Date(notification.createdAt).getTime(),
  };
}

// POST /users/:id/notifications { type, actorId, vehicleId?, reviewId? }
const createNotification = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const { type, actorId, vehicleId, reviewId } = req.body;
    if (!type || !actorId) {
      return res.status(400).json({ error: "type y actorId son obligatorios" });
    }
    // No te notificas a ti mismo (darte like o seguirte a ti mismo).
    if (recipientId === actorId) {
      return res.sendStatus(204);
    }
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const notification = await Notification.create({
      recipientId,
      type,
      actorId,
      vehicleId: vehicleId ?? null,
      reviewId: reviewId ?? null,
    });
    res.status(201).json(toNotificationResponse(notification));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { recipientId: req.params.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications.map(toNotificationResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createNotification, getNotifications };
