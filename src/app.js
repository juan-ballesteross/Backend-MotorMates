import express from "express";
import userRoutes from "./routes/users.routes.js";
import vehicleRoutes from "./routes/vehicles.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";

const app = express();
app.use(express.json());

app.use(userRoutes);
app.use(vehicleRoutes);
app.use(reviewRoutes);
app.use(notificationRoutes);
 
export default app;