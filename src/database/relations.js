import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Review from "../models/Review.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";

function setupRelations() {
  // Usuario <-> Review (uno a muchos)
  User.hasMany(Review, {
    foreignKey: "userId",
    as: "reviews",
    onDelete: "cascade",
    hooks: true,
  });
  Review.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Vehicle <-> Review (uno a muchos)
  Vehicle.hasMany(Review, {
    foreignKey: "vehicleId",
    as: "reviews",
    onDelete: "cascade",
    hooks: true,
  });
  Review.belongsTo(Vehicle, {
    foreignKey: "vehicleId",
    as: "vehicle",
  });

  // Review <-> Like y User <-> Like: si se borra la review o el usuario,
  // sus likes se van con él y el contador queda consistente.
  Review.hasMany(Like, { foreignKey: "reviewId", as: "likes", onDelete: "cascade", hooks: true });
  Like.belongsTo(Review, { foreignKey: "reviewId", as: "review" });
  User.hasMany(Like, { foreignKey: "userId", as: "likes", onDelete: "cascade", hooks: true });
  Like.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Follow: dos llaves foráneas hacia users (quien sigue y a quien sigue).
  User.hasMany(Follow, { foreignKey: "followerId", as: "followingLinks", onDelete: "cascade", hooks: true });
  User.hasMany(Follow, { foreignKey: "followingId", as: "followerLinks", onDelete: "cascade", hooks: true });
  Follow.belongsTo(User, { foreignKey: "followerId", as: "follower" });
  Follow.belongsTo(User, { foreignKey: "followingId", as: "following" });

  User.hasMany(Notification, { foreignKey: "recipientId", as: "notifications", onDelete: "cascade", hooks: true });
  Notification.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });
}

export { setupRelations };
