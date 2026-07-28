import RoomCard from "@/components/RoomCard";
import Image from "next/image";

interface Room {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
}

export default function Rooms({
  rooms,
  onDelete,
}: {
  rooms: Room[];
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-6">
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <Image
            src="/empty-docs.svg"
            alt="No rooms"
            width={64}
            height={64}
            className="mb-4 opacity-50"
          />
          <p className="text-lg font-medium">No rooms yet</p>
          <p className="text-sm mt-1">
            Create a room to start collaborating
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {rooms.map((r) => (
            <RoomCard
              key={r.id}
              name={r.slug}
              createdAt={r.createdAt}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
