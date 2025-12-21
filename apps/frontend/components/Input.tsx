import { forwardRef } from "react";

interface InputProps{
  placeholder : string,
  type : "text" | "password",
  className? : string
}


const Input = forwardRef<HTMLInputElement,InputProps>((props,ref)=> {
  return <input type={props.type} placeholder={props.placeholder} className={`${props.className} bg-zinc-500 w-72 p-2 outline none rounded-md text-lg`} ref={ref}/>;
});

Input.displayName = "Input";

export default Input;