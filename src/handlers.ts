import { Request, Response } from "express";
import { generateProgressionBody } from "./generator.js";
import { db } from "./index.js";
import { hashPassword } from "./encryption.js";
import {
  authenticateUser,
  parseBasicAuthHeader,
  passwordIsValid,
  songAlreadyPresent,
  usernameIsTaken,
  usernameIsValid,
  validateProgressionBody,
} from "./validation.js";
import { Progression } from "./models.js";

// TODO: Add some documentation for this stuff
export async function getProgression(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
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
        res.status(500).send("Internal server error\n");
      });

    res.status(200).json(body);
  } else {
    res.status(401).send("Unauthorized\n");
  }
}

// Return a progression name and body for a user
// Only if the user is the owner of the progression
export async function getProgressionByName(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");
  }

  if (!req.params.name) {
    res.status(400).send("Bad request, please provide a progression name\n");
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    db.serialize(() => {
      db.get(
        "SELECT progression.name, progression.body FROM progression INNER JOIN user ON progression.user_id = user.id WHERE username = ? AND progression.name = ?",
        [credentials.username, req.params.name],
        (err, row) => {
          if (err) {
            console.error("Query failure:", err);
            res.status(500).send("Internal server error\n");
          }

          if (row !== undefined) {
            (<Progression>row).body = JSON.parse(
              // Assert row has body, convert to unknown so that it can be cast to string
              // typescript refuses casting to string directly
              <string>(<unknown>(<Progression>row).body)
            );
            res.status(200).json(row);
          } else {
            res.status(404).send("Progression not found\n");
          }
        }
      );
    });
  } else {
    res.status(401).send("Unauthorized\n");
  }
}

// Return list of progression names for a given user
export async function getProgressionByUser(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    db.serialize(() => {
      db.all(
        "SELECT progression.name FROM progression INNER JOIN user ON progression.user_id = user.id WHERE username = ?",
        credentials.username,
        (err, rows) => {
          if (err) {
            console.error("Query failure:", err);
            res.status(500).send("Internal server error\n");
          }

          if (rows) {
            res.status(200).json(rows);
          }
        }
      );
    });
  } else {
    res.status(401).send("Unauthorized\n");
  }
}

export async function postProgression(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");

    return;
  }

  if (!req.body.name || !req.body.body) {
    res
      .status(400)
      .send("Request body must contain name and body fields for progression\n");

    return;
  }

  if (req.body.name.length > 40 || req.body.name.length < 4) {
    res.status(400).send("Progression name must be less than 24 characters\n");

    return;
  }

  if (!validateProgressionBody(req.body.body)) {
    res.status(400).send("Progression body is invalid\n");

    return;
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    if (await songAlreadyPresent(credentials.username, req.body.name)) {
      res.status(409).send("Progression already exists\n");
    } else {
      db.serialize(() => {
        db.run(
          "INSERT INTO progression (name, body, user_id) VALUES (?, ?, (SELECT id FROM user WHERE username = ?))",
          [req.body.name, JSON.stringify(req.body.body), credentials.username],
          (err) => {
            if (err) {
              console.error("Query failure:", err);
              res.status(500).send("Internal server error\n");
            }

            res.status(201).send("New progression successfully saved\n");
          }
        );
      });
    }
  } else {
    res.status(401).send("Unauthorized\n");
  }
}

export async function deleteProgression(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");

    return;
  }

  if (!req.params.name) {
    res.status(400).send("Bad request, please provide a progression name\n");

    return;
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    if (!(await songAlreadyPresent(credentials.username, req.params.name))) {
      res.status(404).send("Progression not found\n");

      return;
    }

    db.serialize(() => {
      db.run(
        "DELETE FROM progression WHERE name = ? AND user_id = (SELECT id FROM user WHERE username = ?)",
        [req.params.name, credentials.username],
        (err) => {
          if (err) {
            console.error("Query failure:", err);
            res.status(500).send("Internal server error\n");
          }

          res.status(204).send("Progression successfully deleted\n");
        }
      );
    });
  } else {
    res.status(401).send("Unauthorized\n");
  }
}

// This endpoint is exceptional because it does not require authentication
// Will handle potential insecurities via rate limiting
export async function postUser(req: Request, res: Response): Promise<void> {
  // Check that the username and password are valid first
  const username = req.body.username ? req.body.username : null;
  const password = req.body.password ? req.body.password : null;

  if (!username || !password) {
    res.status(400).send("Request body must contain username and password\n");

    return;
  }

  if (!usernameIsValid(username)) {
    res
      .status(400)
      .send(
        "Invalid username, ensure it is between 8 and 24 characters long and contains only letters and numbers\n"
      );

    return;
  }

  if (!passwordIsValid(password)) {
    res
      .status(400)
      .send(
        "Invalid password, ensure it is between 8 and 24 characters long\n"
      );

    return;
  }

  // Check that the username is not already taken
  if (await usernameIsTaken(req.body.username)) {
    res.status(409).send("Username is already taken\n");

    return;
  }

  db.serialize(() => {
    db.run("INSERT INTO user (username, password) VALUES (?, ?)", [
      username,
      hashPassword(password!),
    ]);
  });

  res.status(201).send("New user account successfully created\n");
}

export async function patchUser(req: Request, res: Response): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");

    return;
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (!req.body.newPassword) {
    res.status(400).send("Request body must contain newPassword field\n");

    return;
  }

  if (!passwordIsValid(req.body.newPassword)) {
    res.status(400).send("Invalid new password\n");

    return;
  }

  if (await authenticateUser(credentials.username, credentials.password)) {
    db.serialize(() => {
      db.run("UPDATE user SET password = ? WHERE username = ?", [
        hashPassword(req.body.newPassword),
        credentials.username,
      ]);

      res.status(200).send("Password successfully updated\n");
    });
  } else {
    res.status(401).send("Invalid username or password\n");
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  if (!req.headers.authorization) {
    res.status(401).send("Authorization header required\n");

    return;
  }

  const credentials = parseBasicAuthHeader(req.headers.authorization!);

  if (await authenticateUser(credentials.username, credentials.password)) {
    db.serialize(() => {
      db.run("DELETE FROM user WHERE username = ?", [credentials.username]);

      res.status(204).send("User successfully deleted\n");
    });
  } else {
    res.status(401).send("Invalid username or password\n");
  }
}
