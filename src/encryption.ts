import bcrypt from "bcryptjs";

// Using bcrypt to hash the password
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

// Need to select the hash from the db and then compare to user provided password
export function authUser(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
