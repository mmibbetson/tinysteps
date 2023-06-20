import { Request, Response } from "express";
import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./db/chord.db");

export function getProgression(req: Request, res: Response): void {
  res.send("Hello progression!\n");
}

export function getProgressionByID(req: Request, res: Response): void {
  db.get(
    "SELECT * FROM progression WHERE id = ?",
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
}

export function getProgressionByUser(req: Request, res: Response): void {
  db.serialize(() => {
    db.all(
      "SELECT * FROM progression WHERE user = ?",
      req.params.user,
      (err, rows) => {
        if (err) {
          console.error("Query failure:", err);
          res.status(500).send("Query failure");
        }

        if (rows) {
          res.json(rows);
        }
      }
    );
  });
}

export function postProgression(req: Request, res: Response): void {
  res.send("Hello new progression!\n");
}

export function deleteProgression(req: Request, res: Response): void {
  res.send("Goodbye progression!\n");
}

export function postUser(req: Request, res: Response): void {
  res.send("Hello register!\n");
}

export function patchUser(req: Request, res: Response): void {
  res.send("Hello update!\n");
}

export function deleteUser(req: Request, res: Response): void {
  res.send("Goodbye user!\n");
}
