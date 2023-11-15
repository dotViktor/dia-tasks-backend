import express from "express";
import { usersController } from "../controllers/users.controllers.js";
import { authController } from "../controllers/auth.controllers.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await usersController.getUsers());
});

router.get("/:id", async (req, res) => {
  res.status(200).send(await usersController.getUsersById(req.params.id));
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Missing required fields");
    return;
  }
  if (await usersController.getUserByEmail(req.body.email)) {
    if (await authController.validateUser(req.body.email, req.body.password)) {
      const [user] = await usersController.getUserByEmail(req.body.email);
      const token = authController.generateToken({
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

router.post("/register", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send("Missing required fields");
    return;
  }
  if (await usersController.getUserByEmail(req.body.email)) {
    res.status(409).send("User already exists");
  } else {
    const hashedPassword = await authController.hashPassword(req.body.password);
    const response = await usersController.addUser(
      req.body.name,
      req.body.email,
      hashedPassword
    );
    res.status(201).send(response);
  }
});

export { router as usersRouter };
