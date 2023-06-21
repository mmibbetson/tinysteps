import { Request, Response } from "express";
import { generateProgressionBody } from "./generator.js";
import { db } from "./index.js";

// NOTE: rootVal and qualityVal are being registered correctl
// NOTE: extensionVal and lengthVal seem to always default to triad and 4
export async function getProgression(
  req: Request,
  res: Response
): Promise<void> {
  const rootVal = req.query.root ? req.query.root : "C";
  const qualityVal = req.query.quality ? req.query.quality : "major";
  const extensionVal = req.query.extension ? req.query.extension : "triad";
  const lengthVal = req.query.length ? req.query.length : 4;
  const body = await generateProgressionBody(
    rootVal?.toString(),
    qualityVal?.toString(),
    extensionVal?.toString(),
    parseInt(lengthVal?.toString())
  );

  let newProgression = {
    id: 0,
    user: 0,
    name: "test",
    body: body,
  };

  res.json(newProgression);
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
