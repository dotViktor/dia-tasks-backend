import { dataBase } from "../config/databasePool.js";

export async function getTasks() {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM Tasks;`);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getTaskById(id) {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM Tasks WHERE id = ?;`, [
      id,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export * as tasksController from "./tasks.controllers.js";
