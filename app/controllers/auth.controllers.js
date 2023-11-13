import jwt from "jsonwebtoken";

export function generateToken(user) {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
}

export * as auth from "./auth.controllers.js";
