import { dataBase } from "../config/databasePool.js";

export async function subTaskCompleter(subTaskID) {
  try {
    const [images] = await dataBase.query(
      `SELECT * FROM Images WHERE SubTaskParentID = ?`,
      [subTaskID]
    );
    const numberOfImages = images.length;

    const [notes] = await dataBase.query(
      `SELECT * FROM Notes WHERE SubTaskParentID = ?`,
      [subTaskID]
    );
    const numberOfNotes = notes.length;
    const [subtask] = await dataBase.query(
      `SELECT * FROM SubTasks WHERE id = ?`,
      [subTaskID]
    );

    const requiredImages = subtask[0].requiredImages;
    const requiredNotes = subtask[0].requiredNotes;
    const subTaskParentID = subtask[0].TaskParentID;

    if (numberOfImages >= requiredImages && numberOfNotes >= requiredNotes) {
      await dataBase.query(`UPDATE SubTasks SET isComplete = 1 WHERE id = ?`, [
        subTaskID,
      ]);
    }
    const [incompleteSubtasksOfTask] = await dataBase.query(
      `SELECT * FROM SubTasks WHERE TaskParentID = ? AND isComplete = 0`,
      [subTaskParentID]
    );

    const numberOfIncompleteSubtasks = incompleteSubtasksOfTask.length;

    if (numberOfIncompleteSubtasks === 0) {
      await dataBase.query(`UPDATE Tasks SET isComplete = 1 WHERE id = ?`, [
        subTaskParentID,
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}
