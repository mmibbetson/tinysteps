// Implement functions for validating username and password strings

import { passwordsMatch } from "./encryption.js";
import { db } from "./index.js";
import { Progression, User } from "./models.js";

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
// export function validateProgressionBody(body: Progression["body"]): boolean {}