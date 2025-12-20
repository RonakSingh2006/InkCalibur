import { ReactNode } from "react";

export default function AuthLayout({children} : {children : ReactNode}){
  return <div className="w-screen h-screen bg-zinc-950 border-t border-zinc-800 flex justify-center items-center">
    {children}
  </div>
}