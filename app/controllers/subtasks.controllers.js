import { dataBase } from "../config/databasePool.js";

export async function getSubTasks() {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM SubTasks;`);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getSubTasksByTaskId(parentTaskId) {
  try {
    const [rows] = await dataBase.query(
      `Select * FROM SubTasks WHERE TaskParentID = ?;`,
      [parentTaskId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function createSubTask(
  taskParentId,
  title,
  desc,
  reqNotes,
  reqImages
) {
  try {
    const [rows] = await dataBase.query(
      `INSERT INTO SubTasks (TaskParentID, title, description, requiredNotes, requiredImages, isComplete) VALUES (?, ?, ?, ?, ?, 0);`,
      [taskParentId, title, desc, reqNotes, reqImages]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSubTask(subTaskId) {
  try {
    const [rows] = await dataBase.query(`DELETE FROM SubTasks WHERE id = ?;`, [
      subTaskId,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function updateSubtaskArray(idsToDelete, subtasksToCreate) {
  try {
    for (const id of idsToDelete) {
      await deleteSubTask(id);
    }
    for (const subtask of subtasksToCreate) {
      await createSubTask(
        subtask.TaskParentID,
        subtask.title,
        subtask.description,
        subtask.requiredNotes,
        subtask.requiredImages
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAllSubtasksByTaskParent(parentTaskId) {
  //return all deleted subtasks' ids
  try {
    const [ids] = await dataBase.query(
      `
      SELECT id FROM SubTasks WHERE TaskParentID = ?;
      `,
      [parentTaskId, parentTaskId]
    );
    const idsToDelete = ids.map((id) => id.id);

    for (const id of idsToDelete) {
      await deleteSubTask(id);
    }

    return { deletedSubTasks: idsToDelete };
  } catch (error) {
    console.log(error);
  }
}

export * as subTasksController from "./subtasks.controllers.js";
