import express from "express";
import { subTasksController } from "../controllers/subtasks.controllers.js";
import { uploadsController } from "../controllers/uploads.controllers.js";
import { notesController } from "../controllers/notes.controllers.js";
const router = express.Router();

router.delete("/:subTaskId", async (req, res) => {
  res
    .status(200)
    .send(await subTasksController.deleteSubTask(req.params.subTaskId));
});

router.get("/:subTaskId/images", async (req, res) => {
  const images = await uploadsController.getImagesBySubtaskId(
    req.params.subTaskId
  );
  const fullImages = images.map((image) => {
    return {
      ...image,
      imagePath: `${req.protocol}://${
        req.hostname
      }:7777${image.imagePath.substring(1)}`,
    };
  });
  res.status(200).send(fullImages);
});

router.delete("/image/:id", async (req, res) => {
  const response = await uploadsController.deleteImage(req.params.id);
  if (!response) {
    return res.status(404).send("Image not found");
  }
  res.status(200).send("Image deleted");
});

router.post("/:subTaskId/notes", async (req, res) => {
  // check if note has title and content
  if (!req.body.title || !req.body.content) {
    return res.status(400).send("Missing title or content");
  }
  const response = await notesController.createNoteForSubTask(
    req.body,
    req.params.subTaskId
  );
  res.status(200).send(response);
});

router.get("/:subTaskId/notes", async (req, res) => {
  const response = await notesController.getNotesBySubtaskId(
    req.params.subTaskId
  );
  res.status(200).send(response);
});

router.delete("/notes/:id", async (req, res) => {
  const response = await notesController.deleteNoteById(req.params.id);
  if (!response) {
    return res.status(404).send("Note not found");
  }
  res.status(200).send("Note deleted");
});

export { router as subtasksRouter };
