interface InputProps{
  placeholder : string,
  type : "text" | "password"
}

export default function Input({placeholder,type} : InputProps){
  return <input type={type} placeholder={placeholder} className="bg-zinc-500 w-72 p-2 outline none rounded-md text-lg"/>
}