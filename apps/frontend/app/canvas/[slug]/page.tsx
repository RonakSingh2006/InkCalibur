import CanvasSocket from "@/components/CanvasSocket";
import { BACKEND_URL } from "@repo/common/config";
import axios from "axios";

export default async function RoomCanvas({params} : {params : Promise<{slug : string}>}){

  const {slug} = await params;
  let id = 0;
  try{
    const response = await axios.get(`${BACKEND_URL}/roomId/${slug}`)
    id = response.data.roomId;
  }
  catch(err){
    console.log(err);
  }

  return <CanvasSocket slug={slug} roomId = {id}/>
} 

