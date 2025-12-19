
"use client"
import { useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {BACKEND_URL, temp_JWT} from "@repo/common/config"

async function createRoom(name : string){
  const response = await axios.post(`${BACKEND_URL}/room`,{
      name
    },{
    headers : {
      Authorization : `${temp_JWT}`
    }
  })

  alert(response.data.message);

  if(response.status === 200){
    return true;
  }

  return false;
}

export default function Home() {

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return (
    <div>
      <input type="text" name="roomId" id="roomId" placeholder="Enter Room Name" ref={inputRef}/>
      <button onClick={async ()=>{
        if(inputRef.current){
          const res = await createRoom(inputRef.current.value);

          if(res){
            router.push(`/room/${inputRef.current?.value}`)
          }
        }
      }}>Create Room</button>

      <button onClick={()=>{
        router.push(`/room/${inputRef.current?.value}`)
      }}>Join Room</button>
    </div>
  );
}
