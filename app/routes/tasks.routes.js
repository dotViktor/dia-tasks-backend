import express from "express";
import { tasksController } from "../controllers/tasks.controllers.js";
import { subTasksController } from "../controllers/subtasks.controllers.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await tasksController.getTasks());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await tasksController.getTaskById(req.params.id));
});

router.post("/", async (req, res) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.startTime ||
    !req.body.endTime
  ) {
    res.status(400).send("Missing required fields");
    return;
  }
  const response = await tasksController.createTask(
    req.body.title,
    req.body.description,
    req.body.startTime,
    req.body.endTime
  );

  if (req.body.assignedUsers) {
    for (const user of req.body.assignedUsers) {
      await tasksController.assignUserToTask(user.id, response.insertId);
    }
  }

  res.status(201).send(response);
});

router.put("/:id", async (req, res) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.startTime ||
    !req.body.endTime
  ) {
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

router.post("/:taskId/remove-user/:userId", async (req, res) => {
  res
    .status(200)
    .send(
      await tasksController.unassignUserFromTask(
        req.params.userId,
        req.params.taskId
      )
    );
});

router.get("/:taskId/assigned-users", async (req, res) => {
  res
    .status(200)
    .send(await tasksController.getAssignedUsersByTaskId(req.params.taskId));
});

router.get("/:taskId/subtasks", async (req, res) => {
  res
    .status(200)
    .send(await subTasksController.getSubTasksByTaskId(req.params.taskId));
});

router.post("/:taskId/subtasks", async (req, res) => {
  if (
    !req.body.TaskParentID ||
    !req.body.title ||
    !req.body.description ||
    !req.body.requiredNotes ||
    !req.body.requiredImages
  ) {
    res.status(400).send("Missing required fields");
    return;
  }
  const response = await subTasksController.createSubTask(
    req.body.TaskParentID,
    req.body.title,
    req.body.description,
    req.body.requiredNotes,
    req.body.requiredImages
  );

  res.status(201).send(response);
});

router.delete("/:taskId/subtasks/:subTaskId", async (req, res) => {
  res
    .status(200)
    .send(await subTasksController.deleteSubTask(req.params.subTaskId));
});

export { router as tasksRouter };
