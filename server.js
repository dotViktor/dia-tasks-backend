import express from "express";
import { usersRouter } from "./app/routes/users.routes.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    "Access-Control-Allow-Credentials": true,
  })
);

app.use("/users", usersRouter);

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
