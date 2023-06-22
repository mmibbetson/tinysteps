import { Request, Response } from "express";
import { generateProgressionBody } from "./generator.js";
import { db } from "./index.js";
import { hashPassword } from "./encryption.js";

// TODO: Add some documentation for this stuff
export async function getProgression(
  req: Request,
  res: Response
): Promise<void> {
  const rootVal = req.query.root ? req.query.root : "C";
  const qualityVal = req.query.quality ? req.query.quality : "major";
  const extensionVal = req.query.extension ? req.query.extension : "triad";
  const lengthVal = req.query.length ? req.query.length : "4";
  const body = await generateProgressionBody(
    rootVal?.toString(),
    qualityVal?.toString(),
    extensionVal?.toString(),
    parseInt(<string>lengthVal)
  );

  res.json(body);
}

export async function getProgressionByID(
  req: Request,
  res: Response
): Promise<void> {
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

export async function getProgressionByUser(
  req: Request,
  res: Response
): Promise<void> {
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

export async function postProgression(
  req: Request,
  res: Response
): Promise<void> {
  res.send("Hello new progression!\n");
}

export async function deleteProgression(
  req: Request,
  res: Response
): Promise<void> {
  res.send("Goodbye progression!\n");
}

export async function postUser(req: Request, res: Response): Promise<void> {
  // set constraints on username and password before running this

  db.run("INSERT INTO user (username, password) VALUES (?, ?)", [
    req.body.username,
    hashPassword(req.body.password),
  ]);

  res.send("Hello new user!\n");
}

export async function patchUser(req: Request, res: Response): Promise<void> {
  res.send("Hello update!\n");
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  res.send("Goodbye user!\n");
}
