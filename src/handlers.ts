import { Request, Response } from "express";
import { generateProgressionBody } from "./generator.js";
import { db } from "./index.js";
import { hashPassword } from "./encryption.js";
import {
  authenticateUser,
  parseBasicAuthHeader,
  passwordIsValid,
  usernameIsTaken,
  usernameIsValid,
} from "./user-validation.js";

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
  )
    .then((body) => body)
    .catch((err) => {
      console.error(err);

      res.status(500).send("Internal server error");
    });

  res.status(200).json(body);
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
        res.status(200).json(row);
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
          res.status(200).json(rows);
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
  // Check that the username and password are valid first
  const username = req.body.username;
  const password = req.body.password;

  if (!usernameIsValid(username)) {
    res
      .status(400)
      .send(
        "Invalid username, ensure it is between 8 and 24 characters long and contains only letters and numbers\n"
      );
  }

  if (!passwordIsValid(password)) {
    res
      .status(400)
      .send(
        "Invalid password, ensure it is between 8 and 24 characters long\n"
      );
  }

  // Check that the username is not already taken
  if (await usernameIsTaken(req.body.username)) {
    res.status(400).send("Username is already taken\n");
  }

  db.run("INSERT INTO user (username, password) VALUES (?, ?)", [
    username,
    hashPassword(password!),
  ]);

  res.status(201).send("New user account successfully created\n");
}

export async function patchUser(req: Request, res: Response): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header must be provided\n");
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    db.run("UPDATE user SET password = ? WHERE username = ?", [
      hashPassword(req.body.newPassword),
      credentials.username,
    ]);

    res.status(200).send("Password successfully updated\n");
  } else {
    res.status(401).send("Invalid username or password\n");
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header must be provided\n");
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    db.run("DELETE FROM user WHERE username = ?", [credentials.username]);

    res.status(200).send("User successfully deleted\n");
  } else {
    res.status(401).send("Invalid username or password\n");
  }
}
