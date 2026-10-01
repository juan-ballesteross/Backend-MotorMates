import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Review from "../models/Review.js";

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
}

export { setupRelations };