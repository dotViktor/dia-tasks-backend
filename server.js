import express from "express";

const app = express();

app.use("/users", async (err, res) => {
  res.status(200).send("users sent");
});

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
