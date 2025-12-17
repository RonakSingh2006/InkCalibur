import "dotenv/config";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Auth } from "./middlewares/auth";
import {JWT_SECRET} from "@repo/backend-common/config"
import {AuthSchema,RoomSchema} from "@repo/common/schema"

const app = express();

app.post("/signup", async (req, res) => {

  const result = AuthSchema.safeParse(req.body);

  if(!result.success){
    return res.status(400).send({
      message : "Incorrect Input",
      error : result.error
    })
  }

  const { username, password } = result.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Store to db

  res.send("Signed Up");
});

app.post("/signin", async (req, res) => {
  const result = AuthSchema.safeParse(req.body);

  if(!result.success){
    return res.status(400).send({
      message : "Incorrect Input",
      error : result.error
    })
  }

  const { username, password } = result.data;

  // get saved password from db
  const passKey = "temp";

  const valid = await bcrypt.compare(password, passKey);

  if (!valid) {
    res.status(403).send("Invalid Password");
  }

  // get id from db

  const id = "temp";

  const token = jwt.sign({userId : id}, JWT_SECRET as string);

  res.send({ token });
});

app.get("/room", Auth, (req : Request, res : Response) => {
  const userId = req.userId;

  const result = RoomSchema.safeParse(req.body);

  if(!result.success){
    return res.status(400).send({
      message : "Incorrect Input",
      error : result.error
    })
  }

  const {name} = result.data;

  res.send("Joined room "+name);

});

app.listen(3001);
