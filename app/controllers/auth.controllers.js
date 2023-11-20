import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dataBase } from "../config/databasePool.js";

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

export async function validateUser(email, incomingPassword) {
  const [[{ password }]] = await dataBase.query(
    "SELECT password FROM Users WHERE email = ?",
    [email]
  );
  const isMatching = await bcrypt.compare(incomingPassword, password);
  return isMatching;
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

export * as authController from "./auth.controllers.js";
