import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { connectDB } from "../api/lib/mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("API error:", err);
    const message = err.message?.includes("MONGODB_URI")
      ? "Database is not configured"
      : "Database connection failed. Check MongoDB Atlas network access.";
    res.status(503).json({ message });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
