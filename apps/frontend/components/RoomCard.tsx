"use client"

import Delete from "@/icons/Delete";
import Button from "./Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";

function getDate(str : string){
  const date = new Date(str);

  return date.toLocaleDateString()
}

export default function RoomCard({name , createdAt , onDelete} : {name : string , createdAt : string , onDelete : (slug : string)=>void}){
  const router = useRouter();

  return <div 
  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-indigo-500 transition w-80 h-56 flex flex-col justify-between">
    <button className="flex-1 flex justify-end" title="delete" onClick={async ()=>{
      try{
        await axios.delete(`${BACKEND_URL}/room/${name}`,{
          headers : {"Authorization" : localStorage.getItem('token')}
        })

        onDelete(name);
      }
      catch(err){
        console.log(err);
      }
    }}>
      <Delete className="text-red-500 cursor-pointer"/>
    </button>

    <div className="flex-3 text-white text-2xl flex items-center justify-center">{name}</div>

    <div className="flex-2 flex justify-between items-center">
      <div className="text-blue-600">Created On : {getDate(createdAt)}</div>
      <Button variant="secondary" size="medium" onClick={()=>{
        router.push(`room/${name}`)
      }} text="Join"/>
    </div>
  </div>
}