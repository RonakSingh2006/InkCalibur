import { ReactNode } from "react"

interface ButtonProps{
  variant : "primary" | "secondary" | "danger"
  size : "sm" | "medium" | "large",
  className? : string,
  text : string,
  onClick : ()=>void,
  auth? : boolean,
  icon? : ReactNode
}

const sizeMap = {
  "sm" : "px-3 py-1.5 text-sm font-medium",
  "large" : "px-8 py-4 font-semibold",
  "medium" : "px-6 py-3 font-medium"
}

const variantMap = {
  "primary" : "border border-zinc-700 hover:bg-zinc-800",
  "secondary" : "bg-indigo-600 hover:bg-indigo-500",
  "danger" : "bg-red-600 hover:bg-red-500"
}

export default function Button(props : ButtonProps){
  return <button 
      className={`${props.className} ${sizeMap[props.size]} rounded-lg ${variantMap[props.variant]} text-white transition cursor-pointer ${props.auth ? "w-72" : ""}`}
      onClick={props.onClick}
    >
          {props.text}
          {props.icon}
  </button>
}