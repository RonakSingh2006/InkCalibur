export default function Card({title,desc} : {title : string , desc : string}){
  return <div 
  className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-indigo-500 transition">
    <h4 className="text-xl font-semibold mb-3">{title}</h4>
    <p className="text-zinc-400 text-sm">{desc}</p>
  </div>
}