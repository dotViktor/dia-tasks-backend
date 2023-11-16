import mysql from "mysql2";
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
    )
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
      console.log("Replacing all dummy data");
      await dataBase.query(`DELETE FROM Users;`);
    }
    await dataBase.query(`
    INSERT INTO Users (name, email, role, password)
    VALUES
    ('Gosho', 'g@g.com', 'admin', '$2b$10$OogmTLy4zCkEYZ4dDguDzOvD8iilVOqx8JGLscCIu.9lNF0MiZw8K'),
    ('Pesho', 'p@p.com', 'client', '$2b$10$OogmTLy4zCkEYZ4dDguDzOvD8iilVOqx8JGLscCIu.9lNF0MiZw8K'),
    ('Tosho', 't@t.com', 'admin', '123456')
    `);
    console.log("Filled dummy data");
  } catch (error) {
    console.log(error);
  }
}

createUsersTable().then(() => {
  fillDummyUsers();
});
