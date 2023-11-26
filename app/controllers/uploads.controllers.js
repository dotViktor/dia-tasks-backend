import { dataBase } from "../config/databasePool.js";
import * as fs from "fs";

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

export async function deleteImage(imageId) {
  try {
    const [result] = await dataBase.query(`SELECT * FROM Images WHERE id = ?`, [
      imageId,
    ]);
    if (result.length === 0) {
      return null;
    }
    const imagePath = result[0].imagePath;
    await dataBase.query(`DELETE FROM Images WHERE id = ?`, [imageId]);

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Image deleted");
    });

    return imagePath;
  } catch (error) {
    console.error(error);
  }
}

export async function getImagesBySubtaskId(subtaskId) {
  try {
    const [result] = await dataBase.query(
      `SELECT * FROM Images WHERE SubTaskParentID = ?`,
      [subtaskId]
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}

export * as uploadsController from "./uploads.controllers.js";
