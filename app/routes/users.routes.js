import express from "express";
import { usersController } from "../controllers/users.controllers.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(usersController.getUsers());
});

export { router as usersRouter };
