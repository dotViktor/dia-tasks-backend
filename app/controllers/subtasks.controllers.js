import { dataBase } from "../config/databasePool.js";

export async function getSubTasks() {
  try {
    const [subTasksQuery] = await dataBase.query(`SELECT * FROM SubTasks;`);
    return subTasksQuery;
  } catch (error) {
    console.log(error);
  }
}

export async function getSubTasksByTaskId(parentTaskId) {
  try {
    const [subTasksQuery] = await dataBase.query(
      `Select * FROM SubTasks WHERE TaskParentID = ?;`,
      [parentTaskId]
    );
    return subTasksQuery;
  } catch (error) {
    console.log(error);
  }
}

export * as subTasksController from "./subtasks.controllers.js";
