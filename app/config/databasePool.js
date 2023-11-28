import mysql from "mysql2";
import * as dotEnv from "dotenv";

dotEnv.config();

export const dataBase = mysql
  .createPool({
    host: "localhost",
    port: process.env.PORT,
    user: "root",
    password: "",
    database: "dia_tasks",
  })
  .promise();
