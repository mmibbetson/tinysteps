import express from "express";
import rateLimit from "express-rate-limit";
import {
  getProgression,
  getProgressionByUser,
  postProgression,
  deleteProgression,
  postUser,
  patchUser,
  deleteUser,
  getProgressionByName,
} from "./handlers.js";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Rate limiter to prevent spamming or cost incursion
// 1 minute window, 60 requests per minute for now
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: "Too many requests, please try again later.",
});

const app = express();
app.set("json spaces", 2); // Prettify JSON output
app.use(express.json({ limit: "12kb" })); // Parse received JSON bodies
app.use(limiter); // Apply rate limiter
const port: number = 8080; // default port to listen

// db access, first get the path to the db and then open it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = __dirname + "/../db/tinysteps.db";
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the tinysteps database.");
});

// API routes
// Progression-related routes
app.get("/api/progression", getProgression);
app.get("/api/progression/name/:name", getProgressionByName);
app.get("/api/progression/user", getProgressionByUser);
app.post("/api/progression", postProgression);
app.delete("/api/progression/name/:name", deleteProgression);

// User-related routes
app.post("/api/user", postUser);
app.patch("/api/user", patchUser);
app.delete("/api/user", deleteUser);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
