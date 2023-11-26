import { dataBase } from "../config/databasePool.js";

export async function createNoteForSubTask(note, subtaskId) {
  try {
    const [result] = await dataBase.query(
      `INSERT INTO Notes (SubTaskParentID, title, content) VALUES (?, ?, ?)`,
      [subtaskId, note.title, note.content]
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getNotesBySubtaskId(subtaskId) {
  try {
    const [result] = await dataBase.query(
      `SELECT * FROM Notes WHERE SubTaskParentID = ?`,
      [subtaskId]
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteNoteById(id) {
  try {
    const [result] = await dataBase.query(`DELETE FROM Notes WHERE id = ?`, [
      id,
    ]);
    return result;
  } catch (error) {
    console.error(error);
  }
}
export * as notesController from "./notes.controllers.js";
