import express from "express";
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database("./tinysteps.db");

// test query syntax and see if tables are good
app.get("/test/:id", (req, res) => {
  db.get(
    "SELECT root, suffix, function FROM chord WHERE id = ?",
    req.params.id,
    (err, row) => {
      if (err) {
        console.error("Query failure:", err);
        res.status(500).send("Query failure");
      }

      if (row) {
        res.json(row);
      }
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
