import express from "express";
import { tasksController } from "../controllers/tasks.controllers.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await tasksController.getTasks());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await tasksController.getTaskById(req.params.id));
});
export { router as tasksRouter };
