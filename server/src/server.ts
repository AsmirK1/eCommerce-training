import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import apiRouter from "./routes/api";
import { connectDB } from "./db";


dotenv.config();
const app = express();
// Use our routes
app.use(cors({ 
    // origin: "http://localhost:3000",
    // methods: ["GET", "POST", "DELETE","PUT"],
    // allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
// Connect to MongoDB


// mongoose
//         .connect(process.env.MONGODB_URL as string)
//         .then(() => console.log("✅ Connected to MongoDB (BAA database)"))
//         .catch((err) => console.log("❌ MongoDB connection error:", err));

app.use("/api", apiRouter);
app.get("/", (req, res) => {
    res.send("server it is running in browser");
})

const PORT = process.env.PORT || 3001;
// app.listen(3001, () => {
//     console.log("server it is running ");
// })
// const PORT = process.env.PORT || 3001;

// // Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
});