import { uploadsController } from "../controllers/uploads.controllers.js";
import express from "express";
import { subTaskCompleter } from "../shared/subtaskcompleter.controllers.js";
const router = express.Router();

router.post("/to-subtask/:subtaskId", (req, res) => {
  if (!req.files) return res.status(400).send("No files uploaded");
  const { image } = req.files;

  if (!image) return res.sendStatus(400);

  if (Array.isArray(image)) {
    image.forEach((file) => {
      if (!file.mimetype.startsWith("image")) {
        return res.status(400).send("File must be an image");
      }
    });

    for (const file of image) {
      uploadsController.uploadImage(file, req.params.subtaskId);
    }
    subTaskCompleter(req.params.subtaskId);
    return res.status(200).send("Files uploaded");
  }

  if (!image.mimetype.startsWith("image")) {
    return res.status(400).send("File must be an image");
  }

  uploadsController.uploadImage(image, req.params.subtaskId);
  subTaskCompleter(req.params.subtaskId);
  res.status(200).send("File uploaded");
});

export { router as uploadsRouter };
