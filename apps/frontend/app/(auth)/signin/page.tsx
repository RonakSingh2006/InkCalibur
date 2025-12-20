"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

export default function SignIn(){
  const router = useRouter();

  return <div className="border-zinc-800 bg-zinc-900 w-80 h-96 rounded-md">
    <div className="text-white text-3xl font-bold text-center m-5">Sign In</div>

    <div className="flex flex-col gap-7 items-center mt-10">
      <Input placeholder="Username" type="text"/>
      <Input placeholder="Password" type="password"/>
    </div>

    <div className="flex flex-col items-center mt-7 gap-5">
      <Button variant="secondary" size="medium" text="Sign In" auth={true} onClick={()=>{}}/>

      <Button variant="primary" size="medium" text="Don’t have an account? Sign up" auth={true} onClick={()=>{router.push("/signup")}} className="text-blue-400 hover:text-blue-300 transition-colors duration-200" />
        
    </div>
  </div>
}