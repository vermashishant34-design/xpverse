import express from "express";
import { connectDB } from "../lib/mongodb";
import { loginUser, logoutUser, refreshTokens, signupUser } from "../lib/auth-service";

const router = express.Router();

router.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const result = await signupUser(req.body.email, req.body.password);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const result = await refreshTokens(req.body.refreshToken);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", (_req, res) => {
  const result = logoutUser();
  res.status(result.status).json(result.body);
});

export default router;
