import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Sample API Route
app.get("/api/tasks", (req, res) => {
  res.json([
    { id: 1, title: "Learn React", completed: false },
    { id: 2, title: "Build Backend", completed: true }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});