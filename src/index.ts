import express from "express";
import {
  getProgression,
  getProgressionByID,
  getProgressionByUser,
  postProgression,
  deleteProgression,
  postUser,
  patchUser,
  deleteUser,
} from "./handlers.js";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
app.set("json spaces", 2); // Pretty-print JSON
app.use(express.json()); // Parse JSON bodies
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
app.get("/api/progression/id/:id", getProgressionByID);
app.get("/api/progression/user/:user", getProgressionByUser);
app.post("/api/progression", postProgression);
app.delete("/api/progression", deleteProgression);

// User-related routes
app.post("/api/user", postUser);
app.patch("/api/user", patchUser);
app.delete("/api/user", deleteUser);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
