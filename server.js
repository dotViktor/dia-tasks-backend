import express from "express";
import { usersRouter } from "./app/routes/users.routes.js";
const app = express();

//middlewares
app.use("/users", usersRouter);
app.use(express.json());

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
