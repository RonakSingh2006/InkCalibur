import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Auth } from "./middlewares/auth";

const app = express();

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Store to db

  res.send("Signed Up");
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  // get saved password from db
  const passKey = "temp";

  const valid = await bcrypt.compare(password, passKey);

  if (!valid) {
    res.status(403).send("Invalid Password");
  }

  // get id from db

  const id = "temp";

  const token = jwt.sign({userId : id}, process.env.JWT_SECRET as string);

  res.send({ token });
});

app.get("/room", Auth, (req : Request, res : Response) => {
  const userId = req.userId;

  // do db calls

  res.send("Joined room");

});

app.listen(3001);
