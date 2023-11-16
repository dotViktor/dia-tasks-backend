import express from "express";
import { usersRouter } from "./app/routes/users.routes.js";
import * as dotenv from "dotenv";
import cors from "cors";
import { tasksRouter } from "./app/routes/tasks.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    "Access-Control-Allow-Credentials": true,
  })
);

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
