import { Router } from "express";
import { getDB } from "../db";
import { ObjectId } from "mongodb";

const router = Router();

// Fake "database"
const USERS = [{ email: "admin@yahoo.com", password: "12345678",}];

// http://localhost:3001/api/auth/login
// POST /api/login
router.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = USERS.find(
    (u) => u.email === email && u.password === password
    );

    if (user) {
    // success
    res.json({
        success: true,
        // token: "fake-jwt-token-12345",
        message: "Login successful",
    });
    } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// CREATE user
router.post("/users", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("users").insertOne(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// READ all users
router.get("/users", async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE user
router.put("/users/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN user
router.post("/auth/login", async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    res.json({ success: true, message: "Login successful", user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
