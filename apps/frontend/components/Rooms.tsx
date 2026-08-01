import RoomCard from "@/components/RoomCard";
import EmptyDocs from "@/icons/EmptyDocs";

interface Room {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
  visibility: "PUBLIC" | "PRIVATE";
  inviteCode: string;
}

export default function Rooms({
  rooms,
  onDelete,
  isSearching,
}: {
  rooms: Room[];
  onDelete: (slug: string) => void;
  isSearching?: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-6">
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <div className="mb-4 opacity-50">
            <EmptyDocs size={64} color="#71717a" />
          </div>
          <p className="text-lg font-medium">
            {isSearching ? "No matching rooms" : "No rooms yet"}
          </p>
          <p className="text-sm mt-1">
            {isSearching
              ? "Try a different search term"
              : "Create a room to start collaborating"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {rooms.map((r) => (
            <RoomCard
              key={r.id}
              name={r.slug}
              createdAt={r.createdAt}
              visibility={r.visibility}
              inviteCode={r.inviteCode}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
