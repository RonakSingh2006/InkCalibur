"use client"

import Button from "@/components/Button";
import SearchBar from "@/components/Searchbar";


export default function DashBoard(){
  return <div className="w-screen h-screen bg-zinc-950 border-t border-zinc-800">
    <nav className="flex items-center justify-between px-8 py-6">

        <h1 className="text-2xl font-bold tracking-wide text-white">
          Ink
          <span className="text-indigo-500">Calibur</span>
        </h1>

        <SearchBar/>

        <div className="flex gap-5">
          <Button text="Create Room" variant="secondary" size="medium" onClick={()=>{}}></Button>
          <Button text="Join Room" variant="secondary" size="medium" onClick={()=>{}}></Button>
        </div>

    </nav>
  </div>
}