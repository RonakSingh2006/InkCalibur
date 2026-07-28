import Search from "@/icons/Search";

export default function SearchBar(){
  return <div className="bg-zinc-800 w-full flex items-center rounded-lg px-2">  
        <input type="text" placeholder="Search rooms..." className="w-full p-2 outline-none text-white text-sm bg-transparent"/>
        <Search className="text-white size-4 shrink-0"/>
  </div>
}