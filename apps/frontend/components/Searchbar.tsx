"use client";

import Search from "@/icons/Search";
import { useEffect, useRef, useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <div className="bg-zinc-800 w-full flex items-center rounded-lg px-2">
      <input
        type="text"
        placeholder="Search rooms by name, year, month or date..."
        className="w-full p-2 outline-none text-white text-sm bg-transparent"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Search className="text-white size-4 shrink-0" />
    </div>
  );
}