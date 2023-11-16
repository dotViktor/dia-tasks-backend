import express from "express";
import { tasksController } from "../controllers/tasks.controllers.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await tasksController.getTasks());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await tasksController.getTaskById(req.params.id));
});

router.post("/", async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.startTime) {
    res.status(400).send("Missing required fields");
    return;
  }
  const response = await tasksController.createTask(
    req.body.title,
    req.body.description,
    req.body.startTime,
    req.body.endTime
  );
  res.status(201).send(response);
});

router.put("/:id", async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.startTime) {
    res.status(400).send("Missing required fields");
    return;
  }
  const response = await tasksController.updateTask(
    req.params.id,
    req.body.title,
    req.body.description,
    req.body.startTime,
    req.body.endTime
  );
  res.status(200).send(response);
});

router.delete("/:id", async (req, res) => {
  res.status(200).send(await tasksController.deleteTaskById(req.params.id));
});

router.post("/:taskId/add-user/:userId", async (req, res) => {
  res
    .status(200)
    .send(
      await tasksController.assignUserToTask(
        req.params.userId,
        req.params.taskId
      )
    );
});
export { router as tasksRouter };
