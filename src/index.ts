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

const app = express();
const port: number = 8080; // default port to listen
export const db = new sqlite3.Database("../tinysteps.db", (err) => {
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

db.close();
