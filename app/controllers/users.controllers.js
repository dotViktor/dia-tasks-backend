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

export * as usersController from "./users.controllers.js";
