import "dotenv/config";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Auth } from "./middlewares/auth";
import {JWT_SECRET} from "@repo/backend-common/config"
import {AuthSchema,RoomSchema,UserSchema} from "@repo/common/schema"
import {prisma} from "@repo/db/client"

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {

  const result = UserSchema.safeParse(req.body);

  if(!result.success){
    return res.status(400).send({
      message : "Incorrect Input",
      error : result.error
    })
  }

  const { username, password , name} = result.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try{

    const check = await prisma.user.findFirst({
      where : {username}
    })

    if(check){
      return res.status(409).send("User already exsists");
    }


    const user = await prisma.user.create({
      data : {
        username,
        password : hashedPassword,
        name : name
      }
    })

    res.send({
      message : "Signed Up",
      userId : user.id
    })
  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }
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

  try{
    const user = await prisma.user.findFirst({
      where : {
        username
      }
    });

    if(!user){
      return res.status(404).send("user Does not exsists");
    }

    const passKey = user.password;

    const valid = await bcrypt.compare(password, passKey);

    if (!valid) {
      return res.status(403).send("Invalid Password");
    }

    const id = user.id;

    const token = jwt.sign({userId : id}, JWT_SECRET as string);
  
    res.send({ token });

  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }

});

app.post("/room", Auth, async (req : Request, res : Response) => {
  
  const result = RoomSchema.safeParse(req.body);
  
  if(!result.success){
    return res.status(400).send({
      message : "Incorrect Input",
      error : result.error
    })
  }
  
  const userId = req.userId;
  if(!userId){
    return res.status(403).send("Unauthorized");
  }
  const {name} = result.data;

  try{

    const valid = await prisma.room.findFirst({
      where :{
        slug : name
      }
    })

    if(valid){
      return res.status(409).send("Room Already exists");
    }

    const room = await prisma.room.create({
      data : {
        slug : name,
        adminId : userId
      }
    })

    res.send({
      message : "Room Created",
      roomId : room.id
    })

  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }

});

app.listen(3001);
