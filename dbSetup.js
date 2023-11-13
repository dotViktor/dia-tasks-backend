import mysql from "mysql2";

const dataBase = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "dia_tasks",
  })
  .promise();

async function createUsersTable() {
  try {
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

createUsersTable();
