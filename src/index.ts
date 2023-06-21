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
import { type } from "os";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
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

  // Execute a SQL query to retrieve all table names from the connected database
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table'",
    (error, rows: { name: string }[]) => {
      if (error) {
        console.error("Error retrieving table names:", error.message);
        // Handle the error appropriately
      } else {
        // Extract table names from the result rows
        const tableNames = rows.map((row) => row.name);

        console.log("Tables in the database:", tableNames);
        // Log or process the table names as needed
      }
    }
  );
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
