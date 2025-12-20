"use client"
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@repo/common/schema";
import { useRef, useState } from "react";
import InputWrapper from "@/components/InputWrapper";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";

export default function SignIn(){
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors,setErrors] = useState<Record<string,string>>({});

  return <div className="border-zinc-800 bg-zinc-900 w-80 h-96 rounded-md">
    <div className="text-white text-3xl font-bold text-center m-5">Sign In</div>

    <div className="flex flex-col gap-3 items-center mt-8">

      <InputWrapper error={errors.username}>
        <Input placeholder="Username" type="text" ref={usernameRef}/>
      </InputWrapper>

      <InputWrapper error={errors.password}>
        <Input placeholder="Password" type="password" ref={passwordRef}/>
      </InputWrapper>

    </div>

    <div className="flex flex-col items-center mt-5 gap-3">
      <Button variant="secondary" size="medium" text="Sign In" auth={true} onClick={async ()=>{

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        const authData = {
          username,
          password
        }

        const result = AuthSchema.safeParse(authData);

        if(!result.success){
          const fieldErrors = result.error.flatten().fieldErrors;

          setErrors({
            username: fieldErrors.username?.[0] ?? "",
            password: fieldErrors.password?.[0] ?? "",
          });

          return;
        }

        const response = await axios.post(`${BACKEND_URL}/signin`,authData);

        if(response.status === 200){
          const token = response.data.token;

          localStorage.setItem('token',token);

          router.push("/dashboard")
        }
        else{
          console.log(response.data);
        }
        

      }}/>

      <Button variant="primary" size="medium" text="Don’t have an account? Sign up" auth={true} onClick={()=>{router.push("/signup")}} className="text-blue-400 hover:text-blue-300 transition-colors duration-200" />

    </div>
  </div>
}