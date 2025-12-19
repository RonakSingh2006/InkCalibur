import { BACKEND_URL } from "@repo/common/config"
import axios from "axios"
import ChatRoomClient from "./ChatRoomClient";

async function getChats(slug : string) {
  const response = await axios.get(`${BACKEND_URL}/chats/${slug}`);
  return response.data.chats;
}

async function getRoomId(slug : string) {
  const response = await axios.get(`${BACKEND_URL}/roomId/${slug}`);

  return response.data.roomId;
}

export default async function ChatRoom({slug} : {slug : string}){

  const chats = await getChats(slug);

  const roomId = await getRoomId(slug);
  return <div>
    <ChatRoomClient chats={chats} id={roomId}/>
  </div>
}