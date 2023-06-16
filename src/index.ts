import express from "express";
import { getProgression } from "./handlers.js";
import "sqlite3";

const app = express();
const port = 8080; // default port to listen

// test handler on default route
app.get("/", getProgression);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
