interface ButtonProps{
  variant : "primary" | "secondary"
  size : "medium" | "large",
  className? : string,
  text : string,
  onClick : ()=>void;
}

const sizeMap = {
  "large" : "px-8 py-4 font-semibold",
  "medium" : "px-6 py-3 font-medium"
}

const variantMap = {
  "primary" : "border border-zinc-700 hover:bg-zinc-800",
  "secondary" : "bg-indigo-600 hover:bg-indigo-500"
}

export default function Button(props : ButtonProps){
  return <button 
      className={`${sizeMap[props.size]} rounded-lg ${variantMap[props.variant]} transition ${props.className} cursor-pointer`}
      onClick={props.onClick}
    >
          {props.text}
  </button>
}