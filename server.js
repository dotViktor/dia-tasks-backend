import express from "express";
import { usersRouter } from "./app/routes/users.routes.js";
import * as dotenv from "dotenv";
import cors from "cors";
import { tasksRouter } from "./app/routes/tasks.routes.js";
import swaggerFile from "./swagger-output.json" assert { type: "json" };
import fileUpload from "express-fileupload";
import * as swagger from "swagger-ui-express";
import { uploadsRouter } from "./app/routes/uploads.routes.js";
import { subtasksRouter } from "./app/routes/subtasks.routes.js";
import { authController } from "./app/controllers/auth.controllers.js";

dotenv.config();
export const app = express();

app.use(fileUpload());
app.use("/api-docs", swagger.serve, swagger.setup(swaggerFile));
app.use(express.json());
app.use(
  cors({
    "Access-Control-Allow-Credentials": true,
  })
);

app.use(
  "/users",
  //  authController.authenticateToken,
  usersRouter
);
app.use("/tasks", tasksRouter);
app.use("/images", express.static("images"));
app.use("/upload", uploadsRouter);
app.use("/subtasks", subtasksRouter);

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
