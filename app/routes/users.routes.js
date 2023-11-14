import express from "express";
import { usersController } from "../controllers/users.controllers.js";
import { auth } from "../controllers/auth.controllers.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await usersController.getUsers());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await usersController.getUsersById(req.params.id));
});

router.post("/login", async (req, res) => {
  if (await usersController.getUserByEmail(req.body.email)) {
    if (await auth.validateUser(req.body.email, req.body.password)) {
      const [user] = await usersController.getUserByEmail(req.body.email);
      const token = auth.generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      res.status(202).send({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } else {
    res.status(404).send("User not found");
  }
});

export { router as usersRouter };
