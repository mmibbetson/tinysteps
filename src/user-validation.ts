// Implement functions for validating username and password strings

import { userIsAuthenticated } from "./encryption.js";
import { db } from "./index.js";
import { User } from "./models.js";

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
    db.get("SELECT * FROM user WHERE username = ?", username, (err, row) => {
      if (err) {
        reject(err);
      }

      if (row && "password" in <Object>row) {
        resolve(userIsAuthenticated(password, <Object>row.password));
      }

      resolve(false);
    });
  });
}
