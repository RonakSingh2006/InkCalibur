import "dotenv/config";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Auth } from "./middlewares/auth";
import {JWT_SECRET} from "@repo/backend-common/config"
import {AuthSchema,RoomSchema,UserSchema} from "@repo/common/schema"
import {prisma} from "@repo/db/client"
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

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
      return res.status(409).send({message : "User already exsists"});
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
      return res.status(404).send({message : "user Does not exsists"});
    }

    const passKey = user.password;

    const valid = await bcrypt.compare(password, passKey);

    if (!valid) {
      return res.status(403).send({message : "Invalid Password"});
    }

    const id = user.id;

    const token = jwt.sign({userId : id}, JWT_SECRET as string);
  
    res.send({message : "Signed Up", token });

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
    return res.status(403).send({message : "Unauthorized"});
  }
  const {name} = result.data;

  try{

    const valid = await prisma.room.findFirst({
      where :{
        slug : name
      }
    })

    if(valid){
      return res.status(409).send({message : "Room Already exists"});
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

app.get("/shapes/:slug",async (req,res)=>{
  const slug = req.params.slug;

  try{
    const room = await prisma.room.findFirst({
      where : {slug}
    })

    if(!room){
      return res.status(404).send({message : "Invalid room name"});
    }

    const shapes = await prisma.shape.findMany({
      where : {
        roomId : room.id
      }
    })

    res.send({
      message : "Shapes loaded",
      shapes
    })
  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }
  
})

app.get("/roomId/:slug",async (req,res)=>{
  const slug = req.params.slug;

  try{
    const room = await prisma.room.findFirst({
      where : {slug}
    })

    if(!room){
      return res.status(404).send({message : "Room Does not exsists"});
    }

    res.send({
      roomId : room.id
    })
  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }
})

app.get("/me",Auth,(req,res)=>{
  res.send({
    message : "Authenticated"
  })
})

app.get("/rooms", Auth , async (req : Request,res)=>{
  const adminId = req.userId;

  try{
    const rooms = await prisma.room.findMany({
      where : {
        adminId
      }
    })

    res.send({
      rooms,
      message : "Sucessfully got data"
    })
  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }
})

app.delete("/room/:slug",Auth,async (req : Request,res)=>{
  const slug = req.params.slug;
  const userId = req.userId;

  try{
    await prisma.room.delete({
      where : {
        slug,
        adminId : userId
      }
    })

    res.send({
      message : "Sucesss"
    })
  }
  catch(error){
    res.status(403).send({
      message : "DB failure",
      error
    });
  }

})

app.listen(3001);
