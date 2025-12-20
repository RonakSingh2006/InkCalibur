"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function SignUp(){
  return <div className="border-zinc-800 bg-zinc-900 w-80 h-80 rounded-md">
    <div className="text-white text-3xl font-bold text-center m-5">Sign In</div>

    <div className="flex flex-col gap-7 items-center mt-10">
      <Input placeholder="Username" type="text"/>
      <Input placeholder="Password" type="password"/>
    </div>

    <div className="flex justify-center">
      <Button variant="secondary" size="medium" text="Sign Up" className="mt-7 px-18 font-bold text-md" onClick={()=>{}}/>
    </div>
  </div>
}