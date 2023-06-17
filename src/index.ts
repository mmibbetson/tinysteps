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
import "sqlite3";

const app = express();
const port: number = 8080; // default port to listen

// api routes
app.get("/api/progression", getProgression);
app.get("/api/progression/id/id", getProgressionByID);
app.get("/api/progression/user/:user", getProgressionByUser);
app.post("/api/progression", postProgression);
app.delete("/api/progression", deleteProgression);
app.post("/api/user", postUser);
app.patch("/api/user", patchUser);
app.delete("/api/user", deleteUser);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
