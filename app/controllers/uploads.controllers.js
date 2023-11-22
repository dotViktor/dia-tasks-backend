import { dataBase } from "../config/databasePool.js";
// TODO: CHECK IF IMAGE EXISTS, RENAME IF IT DOES

export async function uploadImage(image) {
  try {
    const [result] = await dataBase.query(
      `INSERT INTO Images (imagePath) VALUES (?)`,
      [`./images/${image.name}`]
    );
    image.mv("./images/" + image.name);
    return result;
  } catch (error) {
    console.error(error);
  }
}

export * as uploadsController from "./uploads.controllers.js";
