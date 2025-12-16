import { NextFunction , Request , Response } from "express";
import jwt from "jsonwebtoken"

export function Auth(req : Request,res : Response,next : NextFunction){
  const token = req.headers["authorization"] || "";

  if(!token){
    return res.status(401).send("Unauthorized");
  }

  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET as string);

    const id = decoded;

    req.userId = id as string;

    next();
  } 
  catch(err){
    res.status(401).send({
      message : "Invalid Token",
      err
    });
  }
}