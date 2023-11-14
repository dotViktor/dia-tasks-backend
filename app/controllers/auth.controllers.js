import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByEmail } from "./users.controllers.js";

export function generateToken(user) {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
}

export async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function validateUser(email, password) {
  const user = await getUserByEmail(email);
  const isMatching = await bcrypt.compare(password, user[0].password);
  return isMatching;
}

export * as authController from "./auth.controllers.js";
