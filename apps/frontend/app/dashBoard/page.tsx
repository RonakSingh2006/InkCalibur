"use client"

import Button from "@/components/Button";
import SearchBar from "@/components/Searchbar";
import RoomCard from "@/components/RoomCard";


export default function DashBoard(){
  const rooms = [
    {id : "abc" , name: "DSA Practice", members: 4 },
    {id : "abcd" , name: "System Design", members: 2 },
    {id : "abcdd" , name: "DSA Practice", members: 4 },
    {id : "abdd" , name: "System Design", members: 2 },
    {id : "ac" , name: "DSA Practice", members: 4 },
    {id : "acd" , name: "System Design", members: 2 }
  ];


  return <div className="w-screen h-screen bg-zinc-950 border-t border-zinc-800 flex flex-col">
    <div className="flex items-center justify-between px-8 py-6">

        <h1 className="text-2xl font-bold tracking-wide text-white">
          Ink
          <span className="text-indigo-500">Calibur</span>
        </h1>

        <SearchBar/>

        <div className="flex gap-5">
          <Button text="Create Room" variant="secondary" size="medium" onClick={()=>{}}></Button>
          <Button text="Join Room" variant="secondary" size="medium" onClick={()=>{}}></Button>
        </div>

    </div>
    
    <div className="w-screen flex-1 flex gap-14 m-8 flex-wrap">

      {rooms.map((r)=> <RoomCard key={r.id}  name={r.name} members={r.members}/>)}

    </div>

  </div>
}