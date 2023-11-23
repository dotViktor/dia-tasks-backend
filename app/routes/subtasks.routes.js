import express from "express";
import { subTasksController } from "../controllers/subtasks.controllers.js";
import { uploadsController } from "../controllers/uploads.controllers.js";
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

export { router as subtasksRouter };
