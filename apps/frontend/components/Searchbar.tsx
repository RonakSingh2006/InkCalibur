import Search from "@/icons/Search";

export default function SearchBar(){
  return <div className="bg-zinc-800 w-96 flex items-center rounded-lg px-2">  
        <input type="text" placeholder="Searching" className="w-96 p-2 outline-none text-white"/>
        <Search className="text-white"/>
  </div>
}