"use client";

import Button from "@/components/Button";
import SearchBar from "@/components/Searchbar";
import { useState } from "react";
import Rooms from "@/components/Rooms";
import JoinRoom from "@/components/JoinRoom";
import CreateRoom from "@/components/CreateRoom";

interface Room {
  id: string;
  slug: string;
  members: number;
}

export default function DashBoard() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "abc", slug: "DSA Practice", members: 4 },
    { id: "abcd", slug: "System Design", members: 2 },
    { id: "abcdd", slug: "DSA Practice", members: 4 },
    { id: "abdd", slug: "System Design", members: 2 },
    { id: "ac", slug: "DSA Practice", members: 4 },
    { id: "acd", slug: "System Design", members: 2 },
  ]);

  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);

  return (
    <div>
      <div
        className={`relative w-screen h-screen bg-zinc-950 border-t border-zinc-800 flex flex-col overflow-hidden ${joinRoomOpen || createRoomOpen ? "opacity-80" : ""}`}
      >
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Ink
            <span className="text-indigo-500">Calibur</span>
          </h1>

          <SearchBar />

          <div className="flex gap-5">
            <Button
              text="Create Room"
              variant="secondary"
              size="medium"
              onClick={() => {
                setCreateRoomOpen(true);
              }}
            ></Button>
            <Button
              text="Join Room"
              variant="secondary"
              size="medium"
              onClick={() => {
                setJoinRoomOpen(true);
              }}
            ></Button>
          </div>
        </div>

        <Rooms rooms={rooms} />
      </div>


      {(joinRoomOpen || createRoomOpen) && 

      <div className="w-screen h-screen inset-0 absolute overflow-hidden flex justify-center items-center">
        {joinRoomOpen && <JoinRoom closeRoom={()=>{
          setJoinRoomOpen(false);
        }}/>}

        {createRoomOpen && <CreateRoom closeRoom={()=>{
          setCreateRoomOpen(false);
        }}/>}

      </div>}
    </div>
  );
}
