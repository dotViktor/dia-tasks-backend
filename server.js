import express from "express";
import { usersRouter } from "./app/routes/users.routes.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

//middlewares
app.use("/users", usersRouter);
app.use(express.json());
app.use(cors());

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
