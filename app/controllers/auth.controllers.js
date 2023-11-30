import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dataBase } from "../config/databasePool.js";

export function generateAccessToken(user) {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3h",
  });
  return token;
}

export function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  return refreshToken;
}

export function refreshAccessToken(refreshToken) {
  const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const accessToken = generateAccessToken(user);
  return accessToken;
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
  if (req.path === "/login" || req.path === "/register") return next();
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err.name === "TokenExpiredError") return res.status(401).send(err);
    if (err) return res.status(403).send(err);
    req.user = user;
    next();
  });
}

export * as authController from "./auth.controllers.js";
