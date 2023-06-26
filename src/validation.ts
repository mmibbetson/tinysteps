// Implement functions for validating username and password strings

import { passwordsMatch } from "./encryption.js";
import { db } from "./index.js";
import {
  Progression,
  User,
  extensions,
  functions,
  roots,
  suffixes,
} from "./models.js";

export function usernameIsValid(username: string): boolean {
  // username must be between 4 and 20 characters
  if (username.length < 4 || username.length > 20) {
    return false;
  }

  // username must contain only alphanumeric characters
  if (username.match(/^[a-zA-Z0-9]+$/g) === null) {
    return false;
  }

  return true;
}

export function passwordIsValid(password: string): boolean {
  // password must be between 8 and 24 characters
  if (password.length < 8 || password.length > 24) {
    return false;
  }

  // password must contain only alphanumeric characters and symbols
  if (password.match(/^[a-zA-Z0-9!@#$%^&*()]+$/g) === null) {
    return false;
  }

  return true;
}

// check if username exists in db, if so return true, else return false
export async function usernameIsTaken(username: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM user WHERE username = ?", username, (err, row) => {
      if (err) {
        reject(err);
      }

      resolve(row !== undefined);
    });
  });
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, username, password FROM user WHERE username = ?",
      username,
      (err, row) => {
        if (err) {
          reject(err);
        }

        if (row && "password" in <User>row) {
          resolve(passwordsMatch(password, (<User>row).password));
        }

        resolve(false);
      }
    );
  });
}

export function parseBasicAuthHeader(authHeader: string): {
  username: string;
  password: string;
} {
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  return { username, password };
}

// TODO: Move this function
export async function getUserID(username: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM user WHERE username = ?", username, (err, row) => {
      if (err) {
        reject(err);
      }

      if (row && "id" in <User>row) {
        resolve((<User>row).id);
      }

      reject("User not found");
    });
  });
}

// Need to check that the body received actually fits the constraints of the API
export function validateProgressionBody(body: Progression["body"]): boolean {
  // check that body is an array
  if (!Array.isArray(body)) {
    return false;
  }

  // check that body is within the length delimiters
  if (body.length < 4 || body.length > 16) {
    return false;
  }

  // check that each item in the array is an object with the correct fields
  for (const chord of body) {
    if (typeof chord !== "object") {
      return false;
    }

    if (
      chord.root === undefined ||
      chord.suffix === undefined ||
      chord.extension === undefined ||
      chord.function === undefined
    ) {
      return false;
    }

    // ensure that the values of each field are within the valid values for that field
    if (
      !roots.some((root) => root === chord.root) ||
      !suffixes.some((suffix) => suffix === chord.suffix) ||
      !extensions.some((extension) => extension === chord.extension) ||
      !functions.some((func) => func === chord.function)
    ) {
      return false;
    }
  }

  return true;
}

export async function songAlreadyPresent(
  username: string,
  name: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        "SELECT progression.name FROM progression INNER JOIN user ON progression.user_id = user.id WHERE username = ? AND progression.name = ?",
        [username, name],
        (err, row) => {
          if (err) {
            console.error("Query failure:", err);
            reject(err);
          }

          if (row !== undefined) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  });
}
