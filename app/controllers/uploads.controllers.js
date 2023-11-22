import { dataBase } from "../config/databasePool.js";

export async function uploadImage(image, subtaskId) {
  try {
    const timestamp = new Date().getTime();
    let imagePath = `./images/${timestamp}_${image.name}`;

    const [imagePathRes] = await dataBase.query(
      `SELECT * FROM Images WHERE imagePath = ?`,
      [imagePath]
    );

    if (imagePathRes.length > 0) {
      console.log("Image already exists");
      const randomChars = Math.random().toString(36).substring(2, 6);
      imagePath = `./images/${timestamp}_${randomChars}_${image.name}`;
    }

    const [result] = await dataBase.query(
      `INSERT INTO Images (SubTaskParentID, imagePath) VALUES (?, ?)`,
      [subtaskId, imagePath]
    );
    image.mv(imagePath);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export * as uploadsController from "./uploads.controllers.js";
