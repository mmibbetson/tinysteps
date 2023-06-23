// Implement functions for validating username and password

import { db } from "./index.js";

export function validateUsername(username: string): {
  value: string | null;
  valid: boolean;
} {
  return { value: null, valid: false };
}

export function validatePassword(password: string): {
  value: string | null;
  valid: boolean;
} {
  return { value: null, valid: false };
}

// check if username exists in db, if so return true, else return false
export async function checkUserIsTaken(username: string): Promise<boolean> {
  db.get("SELECT * FROM user WHERE username = ?", username, (err, row) => {
    if (err) {
      throw new Error("Query failure when checking if username is taken");
    }

    if (row) {
      if (row === undefined) {
        return false;
      }

      return true;
    }
  });

  throw new Error("Query failure when checking if username is taken");
}
