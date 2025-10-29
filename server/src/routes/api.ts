import { Router, Request, Response } from "express";
import { getDB } from "../db";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";


const router = Router();

// // Fake "database"
// const USERS = [{ email: "admin@yahoo.com", password: "12345678",}];

// // http://localhost:3001/api/auth/login
// // POST /api/login
// router.post("/auth/login", (req, res) => {
//     const { email, password } = req.body;
//     const user = USERS.find(
//     (u) => u.email === email && u.password === password
//     );

//     if (user) {
//     // success
//     res.json({
//         success: true,
//         // token: "fake-jwt-token-12345",
//         message: "Login successful",
//     });
//     } else {
//     res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
// });

// // CREATE user
// router.post("/users", async (req, res) => {
//   try {
//     const db = getDB();
//     const result = await db.collection("users").insertOne(req.body);
//     res.status(201).json({ success: true, data: result });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // READ all users
// router.get("/users", async (req, res) => {
//   try {
//     const db = getDB();
//     const users = await db.collection("users").find().toArray();
//     res.json(users);
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // UPDATE user
// router.put("/users/:id", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     const result = await db
//       .collection("users")
//       .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
//     res.json({ success: true, data: result });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // DELETE user
// router.delete("/users/:id", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
//     res.json({ success: true, data: result });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // LOGIN user
// router.post("/auth/login", async (req, res) => {
//   try {
//     const db = getDB();
//     const { email, password } = req.body;
//     const user = await db.collection("users").findOne({ email, password });
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//     res.json({ success: true, message: "Login successful", user });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// --- LOGIN USER ---
router.post("/auth/login", async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Find the user in MongoDB
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check password match
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name ?? "Anonymous",
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// UPDATE   
router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const { email, password, name } = req.body;

    // 1️⃣ Check required fields
    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    // 2️⃣ Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    // 3️⃣ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user object
    const newUser = {
      email,
      password: hashedPassword,
      name: name || "Anonymous",
      createdAt: new Date(),
    };

    // 5️⃣ Insert into MongoDB
    const result = await db.collection("users").insertOne(newUser);

    // 6️⃣ Send success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: result.insertedId,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err: any) {
    console.error("❌ Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});







export default router;