import mysql from "mysql2";

export const dataBase = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "dia_tasks",
  })
  .promise();
