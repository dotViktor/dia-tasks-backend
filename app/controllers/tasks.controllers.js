import { dataBase } from "../config/databasePool.js";

// we fetch the data for each task seperately as it does not come bundled with users
// TODO: Optimize by bundling the data and reducing the ammount of calls to the database
export async function getTasks() {
  try {
    const [tasksQuery] = await dataBase.query(`SELECT * FROM Tasks;`);
    const tasks = await Promise.all(
      tasksQuery.map(async (task) => {
        const users = await getAssignedUsersByTaskId(task.id);
        return { ...task, users };
      })
    );
    return tasks;
  } catch (error) {
    console.log(error);
  }
}

export async function getTaskById(id) {
  try {
    const [taskQuery] = await dataBase.query(
      `SELECT * FROM Tasks WHERE id = ?;`,
      [id]
    );
    //add an array of users to the task object
    const result = await Promise.all(
      taskQuery.map(async (task) => {
        const users = await getAssignedUsersByTaskId(task.id);
        return { ...task, users };
      })
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function createTask(title, description, startTime, endTime) {
  try {
    const [rows] = await dataBase.query(
      `INSERT INTO Tasks (title, description, startTime, endTime) VALUES (?, ?, ?, ?);`,
      [title, description, startTime, endTime]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function completeTask(id) {
  try {
    const [rows] = await dataBase.query(
      `UPDATE Tasks SET isComplete = 1 WHERE id = ?;`,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function completeSubTask(id) {
  try {
    const [rows] = await dataBase.query(
      `UPDATE SubTasks SET isComplete = 1 WHERE id = ?;`,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTask(id, title, description, startTime, endTime) {
  try {
    const [rows] = await dataBase.query(
      `UPDATE Tasks SET title = ?, description = ?, startTime = ?, endTime = ? WHERE id = ?;`,
      [title, description, startTime, endTime, id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUsersInTask(taskId, users) {
  try {
    const [rows] = await dataBase.query(
      `DELETE FROM UserTasks WHERE TaskID = ?;`,
      [taskId]
    );
    for (const user of users) {
      await assignUserToTask(user.id, taskId);
    }
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTaskById(id) {
  try {
    const [rows] = await dataBase.query(`DELETE FROM Tasks WHERE id = ?;`, [
      id,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function assignUserToTask(userId, taskId) {
  try {
    const [rows] = await dataBase.query(
      `INSERT INTO UserTasks (UserID, TaskID) VALUES (?, ?);`,
      [userId, taskId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function unassignUserFromTask(userId, taskId) {
  try {
    const [rows] = await dataBase.query(
      `DELETE FROM UserTasks WHERE UserID = ? AND TaskID = ?;`,
      [userId, taskId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getAssignedUsersByTaskId(taskId) {
  try {
    const [rows] = await dataBase.query(
      `SELECT id, name, email, role FROM Users WHERE id IN (SELECT UserID FROM UserTasks WHERE TaskID = ?);`,
      [taskId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export * as tasksController from "./tasks.controllers.js";
