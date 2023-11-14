import mysql from "mysql2";
import { dataBase } from "../config/databasePool.js";

export async function getUsers() {
  try {
    const [rows] = await dataBase.query(`
    SELECT * FROM Users;
    `);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsersById(id) {
  try {
    const [rows] = await dataBase.query(
      `
    SELECT * FROM Users WHERE id = ?;
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function addUser(name, email, role, password) {
  try {
    const [rows] = await dataBase.query(
      `
    INSERT INTO Users (name, email, role, password) VALUES (?, ?, ?, ?);
    `,
      [name, email, role, password]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByEmail(email) {
  const [user] = await dataBase.query(`SELECT * FROM Users WHERE email = ?;`, [
    email,
  ]);
  if (user.length > 0) {
    return user;
  }
  return null;
}

export * as usersController from "./users.controllers.js";
