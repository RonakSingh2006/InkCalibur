import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"

export function checkUser(token :string) : null | string{
  try{
    const decoded = jwt.verify(token,JWT_SECRET);

    if(typeof decoded === "string") return null;

    if(!decoded || !decoded.userId){
      return null;
    }

    return decoded.userId;
  }
  catch(err){
    return null;
  }
}