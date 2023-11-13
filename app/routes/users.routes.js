import express from "express";
import { usersController } from "../controllers/users.controllers.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await usersController.getUsers());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await usersController.getUsersById(req.params.id));
});

export { router as usersRouter };
