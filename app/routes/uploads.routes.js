import { uploadsController } from "../controllers/uploads.controllers.js";
import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { image } = req.files;

  if (!image) return res.sendStatus(400);

  if (Array.isArray(image)) {
    image.forEach((file) => {
      if (!file.mimetype.startsWith("image")) {
        return res.status(400).send("File must be an image");
      }
    });

    for (const file of image) {
      uploadsController.uploadImage(file);
    }
    return res.status(200).send("Files uploaded");
  }

  if (!image.mimetype.startsWith("image")) {
    return res.status(400).send("File must be an image");
  }

  uploadsController.uploadImage(image);
  res.status(200).send("File uploaded");
});

export { router as uploadsRouter };
