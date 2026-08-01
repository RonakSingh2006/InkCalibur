"use client";

import Button from "@/components/Button";
import SearchBar from "@/components/Searchbar";
import { useCallback, useEffect, useState } from "react";
import Rooms from "@/components/Rooms";
import JoinRoom from "@/components/JoinRoom";
import CreateRoom from "@/components/CreateRoom";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
  visibility: "PUBLIC" | "PRIVATE";
  inviteCode: string;
}

async function getRooms() {
  try {
    const response = await axios.get(`${BACKEND_URL}/rooms`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    return response.data.rooms;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function searchRooms(query: string) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/rooms/search?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    return response.data.rooms;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function DashBoard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function LoadData() {
      const rooms = await getRooms();
      if (rooms === null) {
        router.push("/signin");
      }
      setRooms(rooms);
      setFilteredRooms(rooms);
    }
    LoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredRooms(rooms);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const results = await searchRooms(query);
    setFilteredRooms(results);
  }, [rooms]);

  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 sm:px-8 py-3">
          {/* Logo */}
          <h1
            className="shrink-0 text-xl font-extrabold tracking-tight text-white cursor-pointer select-none"
            onClick={() => router.push("/")}
          >
            Ink<span className="text-indigo-500">Calibur</span>
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search - hidden on very small screens */}
            <div className="hidden sm:block w-96">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="h-5 w-px bg-zinc-800" />

            <Button
              text="Create Room"
              variant="secondary"
              size="sm"
              onClick={() => setCreateRoomOpen(true)}
            />

            <Button
              text="Join Room"
              variant="primary"
              size="sm"
              onClick={() => setJoinRoomOpen(true)}
            />

            <div className="h-5 w-px bg-zinc-800" />

            <Button
              text="Logout"
              variant="danger"
              size="sm"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-[calc(100vh-61px)]">
        <Rooms
          rooms={filteredRooms}
          onDelete={(slug) => {
            setRooms((prev) => prev.filter((e) => e.slug !== slug));
            setFilteredRooms((prev) => prev.filter((e) => e.slug !== slug));
          }}
          isSearching={isSearching}
        />
      </main>

      {/* Modals */}
      {(joinRoomOpen || createRoomOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {joinRoomOpen && (
            <JoinRoom
              closeRoom={() => {
                setJoinRoomOpen(false);
              }}
            />
          )}
          {createRoomOpen && (
            <CreateRoom
              closeRoom={() => {
                setCreateRoomOpen(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}