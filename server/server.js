import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to your Express backend 🚀" });
});

// Example API route
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Amar", email: "amar@example.com" },
    { id: 2, name: "Sara", email: "sara@example.com" }
  ]);
});

// PORT from .env or fallback
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});