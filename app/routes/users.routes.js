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
      const token = authController.generateAccessToken({
        user,
      });
      res.status(202).send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
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

router.delete("/:id", async (req, res) => {
  res.status(200).send(await usersController.deleteUserById(req.params.id));
});

router.get("/:userID/assigned-tasks", async (req, res) => {
  res
    .status(200)
    .send(await usersController.getAssignedTasksByUserId(req.params.userID));
});

router.get("/:userID/make-admin", async (req, res) => {
  res
    .status(200)
    .send(await usersController.changeClientToAdmin(req.params.userID));
});

router.get("/:userID/make-client", async (req, res) => {
  res
    .status(200)
    .send(await usersController.changeAdminToClient(req.params.userID));
});

router.delete("/:userID", async (req, res) => {
  res.status(200).send(await usersController.deleteUserById(req.params.userID));
});
export { router as usersRouter };
