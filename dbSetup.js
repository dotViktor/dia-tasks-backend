import * as dotenv from "dotenv";
import { dataBase } from "./app/config/databasePool.js";

dotenv.config();

async function createUsersTable() {
  try {
    if (await dataBase.query("SHOW TABLES LIKE 'Users'")) {
      console.log("Users table already exists");
      return;
    }
    await dataBase.query(`
    CREATE TABLE Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      role VARCHAR(255),
      password VARCHAR(255)
    );
  `);

    console.log("Created users table");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

async function fillDummyUsers() {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM Users;`);
    if (rows.length > 0) {
      console.log("Replacing all USERS data");
      await dataBase.query(`TRUNCATE Users;`);
    }
    await dataBase.query(`
    INSERT INTO Users (name, email, role, password)
    VALUES
    ('Gosho', 'g@g.com', 'admin', '$2b$10$OogmTLy4zCkEYZ4dDguDzOvD8iilVOqx8JGLscCIu.9lNF0MiZw8K'),
    ('Pesho', 'p@p.com', 'client', '$2b$10$OogmTLy4zCkEYZ4dDguDzOvD8iilVOqx8JGLscCIu.9lNF0MiZw8K'),
    ('Tosho', 't@t.com', 'admin', '123456')
    `);
    console.log("Filled USERS data");
  } catch (error) {
    console.log(error);
  }
}

//create tasks table
async function createTasksTable() {
  try {
    const [result] = await dataBase.query("SHOW TABLES LIKE 'Tasks'");
    if (result.length > 0) {
      console.log("Tasks table already exists");
      return;
    }
    await dataBase.query(`
    CREATE TABLE Tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description VARCHAR(255),
      startTime DATETIME,
      endTime DATETIME
    )
  `);
    console.log("Created Tasks table");
  } catch (error) {
    console.error(error);
  }
}

async function createUserTasksRelation() {
  try {
    const [result] = await dataBase.query("SHOW TABLES LIKE 'UserTasks'");
    if (result.length > 0) {
      console.log("UserTasks table already exists");
      return;
    }
    await dataBase.query(`
    CREATE TABLE UserTasks (
      UserID int,
      TaskID int,
      PRIMARY KEY (UserID, TaskID),
      FOREIGN KEY (UserID) REFERENCES Users(id),
      FOREIGN KEY (TaskID) REFERENCES Tasks(id)
      )
  `);
    console.log("Created UserTasks table");
  } catch (error) {
    console.log(error);
  }
}

async function fillDummyTasks() {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM Tasks;`);
    if (rows.length > 0) {
      console.log("Replacing all TASKS data");
      await dataBase.query(`TRUNCATE Tasks;`);
    }
    await dataBase.query(`
    INSERT INTO Tasks (title, description, startTime, endTime)
    VALUES
    ('Task 1', 'Description 1', '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
    ('Task 2', 'Description 2', '2022-01-01 00:00:00', '2022-01-01 00:00:00'),
    ('Task 3', 'Description 3', '2022-01-01 00:00:00', '2022-01-01 00:00:00')
    `);
    console.log("Filled TASKS data");
  } catch (error) {
    console.log(error);
  }
}

async function fillUserTasksRelation() {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM UserTasks;`);
    if (rows.length > 0) {
      console.log("Replacing all USERTASKS data");
      await dataBase.query(`TRUNCATE UserTasks;`);
    }
    await dataBase.query(`
    INSERT INTO UserTasks (UserID, TaskID)
    VALUES
    (1, 1),
    (2, 1),
    (3, 3)
    `);
    console.log("Filled USERTASKS data");
  } catch (error) {
    console.log(error);
  }
}

async function createSubTaskTable() {
  try {
    const [result] = await dataBase.query("SHOW TABLES LIKE 'SubTasks'");
    if (result.length > 0) {
      console.log("SubTasks table already exists");
      return;
    }
    await dataBase.query(`
    CREATE TABLE SubTasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      TaskParentID int,
      title VARCHAR(255),
      description VARCHAR(255),
      requiredNotes int,
      requiredImages int,
      isComplete BOOLEAN,
      FOREIGN KEY (TaskParentID) REFERENCES Tasks(id)
    )`);
    console.log("Created SubTasks table");
  } catch (error) {
    console.log(error);
  }
}

async function fillDummySubTasks() {
  try {
    const [rows] = await dataBase.query(`SELECT * FROM SubTasks;`);
    if (rows.length > 0) {
      console.log("Replacing all SUBTASKS data");
      await dataBase.query(`TRUNCATE SubTasks;`);
    }
    await dataBase.query(`
    INSERT INTO SubTasks (TaskParentID, title, description, requiredNotes, requiredImages, isComplete)
    VALUES
    (1, 'SubTask 1', 'Description 1', 0, 0, true),
    (1, 'SubTask 2', 'Description 2', 0, 0, false),
    (3, 'SubTask 3', 'Description 3', 0, 0, false)
    `);
    console.log("Filled SUBTASKS data");
  } catch (error) {
    console.log(error);
  }
}
async function setupDatabase() {
  try {
    await createUsersTable();
    await fillDummyUsers();
    console.log("----");

    await createTasksTable();
    await createUserTasksRelation();
    console.log("----");

    await fillDummyTasks();
    await fillUserTasksRelation();
    console.log("----");

    await createSubTaskTable();
    await fillDummySubTasks();
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDatabase();
