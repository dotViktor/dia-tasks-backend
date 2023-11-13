import express from "express";
import { usersController } from "../controllers/users.controllers.js";
import { generateToken } from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await usersController.getUsers());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await usersController.getUsersById(req.params.id));
});

router.post("/login", (req, res) => {
  const token = generateToken({ email: req.body.email });
  res.status(200).send({ token });
});

export { router as usersRouter };
