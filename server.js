import express from "express";
import { usersRouter } from "./app/routes/users.routes.js";
import * as dotenv from "dotenv";
import cors from "cors";
import { tasksRouter } from "./app/routes/tasks.routes.js";
import swaggerFile from "./swagger-output.json" assert { type: "json" };

import * as swagger from "swagger-ui-express";

dotenv.config();
const app = express();

app.use("/api-docs", swagger.serve, swagger.setup(swaggerFile));
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
