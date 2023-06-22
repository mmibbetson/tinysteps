// Implement functions for validating username and password

export function validateUsername(username: string): {
  value: string | null;
  valid: boolean;
} {}

export function validatePassword(password: string): {
  value: string | null;
  valid: boolean;
} {}

// check if username exists in db, if so return true, else return false
export async function checkUserIsTaken(username: string): Promise<boolean> {
  db.get("SELECT * FROM user WHERE username = ?", username, (err, row) => {}
}
