import RoomCard from "@/components/RoomCard";

interface Room {
  id: string;
  slug: string;
  createdAt : string,
  adminId : string
}

export default function Rooms({rooms , onDelete } : {rooms : Room[] ,onDelete : (slug : string)=>void}){
  return <div className="flex-1 mt-15 mx-10">
        <div className="flex gap-14 flex-wrap">
  
          {rooms.map((r)=> <RoomCard key={r.id}  name={r.slug} createdAt={r.createdAt} onDelete = {onDelete}/>)}
  
        </div>
  
  </div>
}