"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRef, useState } from "react";
import axios from 'axios';
import { BACKEND_URL } from "@repo/common/config";
import { UserSchema } from "@repo/common/schema";
import { useRouter } from "next/navigation";
import InputWrapper from "@/components/InputWrapper";

export default function SignUp(){

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors,setErrors] = useState<Record<string,string>>({});
  const router = useRouter();


  return <div className="border-zinc-800 bg-zinc-900 w-80 h-96 rounded-md">
    <div className="text-white text-3xl font-bold text-center m-5">Sign Up</div>

    <div className="flex flex-col gap-2 items-center mt-8">

      <InputWrapper error={errors.name}>
        <Input placeholder="Name" type="text" ref={nameRef}/>
      </InputWrapper>

      <InputWrapper error={errors.username}>
        <Input placeholder="Username" type="text" ref={usernameRef}/>
      </InputWrapper>

      <InputWrapper error={errors.password}>
        <Input placeholder="Password" type="password" ref={passwordRef}/>
      </InputWrapper>

    </div>

    <div className="flex justify-center">
      <Button variant="secondary" size="medium" text="Sign Up" className="mt-5 px-18 font-bold text-md" auth={true} onClick={async ()=>{
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const name = nameRef.current?.value;

        const user = {
          username,
          password,
          name
        }

        const result = UserSchema.safeParse(user);

        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;

          setErrors({
            name: fieldErrors.name?.[0] ?? "",
            username: fieldErrors.username?.[0] ?? "",
            password: fieldErrors.password?.[0] ?? "",
          });

          return;
        }

        try{
          await axios.post(`${BACKEND_URL}/signup`,user);
          router.push("/signin");
          
        }
        catch(err){
          if(axios.isAxiosError(err)){
            setErrors({
              name: err.response?.data.message
            })
          }
          else{
            setErrors({
              name: "Unexcpected Error"
            })
          }
        }

      }}/>
    </div>
  </div>
}