import mysql from "mysql2";
import { dataBase } from "../config/databasePool.js";

export async function getUsers() {
  try {
    const [rows] = await dataBase.query(`
    SELECT id, name, email, role FROM Users;
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
    SELECT id, name, email, role FROM Users WHERE id = ?;
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function addUser(name, email, password) {
  try {
    const [rows] = await dataBase.query(
      `
    INSERT INTO Users (name, email, role, password) VALUES (?, ?, 'user', ?);
    `,
      [name, email, password]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByEmail(email) {
  const [user] = await dataBase.query(
    `SELECT id, name, email, role FROM Users WHERE email = ?;`,
    [email]
  );
  if (user.length > 0) {
    return user;
  }
  return null;
}

export async function deleteUserById(id) {
  try {
    const [userDeletionResponse] = await dataBase.query(
      `DELETE FROM Users WHERE id = ?;`,
      [id]
    );
    const [userTasksDeletionResponse] = await dataBase.query(
      `DELETE FROM UserTasks WHERE UserID = ?;`,
      [id]
    );
    return { userDeletionResponse, userTasksDeletionResponse };
  } catch (error) {
    console.log(error);
  }
}

export async function getAssignedTasksByUserId(userId) {
  try {
    const [rows] = await dataBase.query(
      `SELECT * FROM Tasks WHERE id IN (SELECT TaskID FROM UserTasks WHERE UserID = ?);`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function changeClientToAdmin(id) {
  try {
    const [rows] = await dataBase.query(
      `UPDATE Users SET role = 'admin' WHERE id = ?;`,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export async function changeAdminToClient(id) {
  try {
    const [rows] = await dataBase.query(
      `UPDATE Users SET role = 'client' WHERE id = ?;`,
      [id]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

export * as usersController from "./users.controllers.js";
