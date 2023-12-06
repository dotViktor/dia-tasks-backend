import express from "express";
import { tasksController } from "../controllers/tasks.controllers.js";
import { subTasksController } from "../controllers/subtasks.controllers.js";
import { notesController } from "../controllers/notes.controllers.js";
import { uploadsController } from "../controllers/uploads.controllers.js";
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

  if (req.body.users) {
    for (const user of req.body.users) {
      await tasksController.assignUserToTask(user.id, response.insertId);
    }
  }

  if (req.body.subtasks) {
    for (const subtask of req.body.subtasks) {
      await subTasksController.createSubTask(
        response.insertId,
        subtask.title,
        subtask.description,
        subtask.requiredNotes,
        subtask.requiredImages
      );
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

  if (req.body.users) {
    await tasksController.updateUsersInTask(req.params.id, req.body.users);
  }
  res.status(200).send({ ...response, addedUsers: req.body.users });
});

router.delete("/:id", async (req, res) => {
  //cascading delete tasks > subtasks > notes/images
  //deletion of tasks and subtasks
  const delTaskResponse = await tasksController.deleteTaskById(req.params.id);
  const delSubTasksResponse =
    await subTasksController.deleteAllSubtasksByTaskParent(req.params.id);
  let deletedNotes = [];
  let deletedImages = [];

  //deletion of notes and images
  for (const subtaskId of delSubTasksResponse.deletedSubTasks) {
    const notesResponse = await notesController.deleteAllNotesBySubtaskParentId(
      subtaskId
    );
    const imagesResponse =
      await uploadsController.deleteAllImagesBySubtaskParentId(subtaskId);

    deletedNotes = [...deletedNotes, ...notesResponse.deletedNotes];
    deletedImages = [...deletedImages, ...imagesResponse.deletedImages];
  }
  res.status(200).send({
    deletedTask: delTaskResponse,
    deletedSubTasks: delSubTasksResponse,
    deletedNotes,
    deletedImages,
  });
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

router.get("/:taskId/complete-task", async (req, res) => {
  res.status(200).send(await tasksController.completeTask(req.params.taskId));
});

router.get("/:taskId/complete-subtask/:subTaskId", async (req, res) => {
  res
    .status(200)
    .send(await subTasksController.completeSubTask(req.params.subTaskId));
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

router.put("/:taskId/update-subtasks", async (req, res) => {
  if (!req.body.deletedSubtasks || !req.body.newSubtasks) {
    return res.status(400).send("Missing required fields");
  }
  await subTasksController.updateSubtaskArray(
    req.body.deletedSubtasks,
    req.body.newSubtasks
  );

  res.status(200).send("Subtasks updated");
});
export { router as tasksRouter };
