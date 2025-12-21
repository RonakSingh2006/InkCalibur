"use client"

import InputWrapper from "@/components/InputWrapper";
import Input from "@/components/Input";
import { RoomSchema } from "@repo/common/schema";
import { BACKEND_URL } from "@repo/common/config";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useState,useRef } from "react";
import Button from "./Button";
import Cross from "@/icons/Cross";

export default function CreateRoom({closeRoom} : {closeRoom : ()=>void}){
  const [errors,setErrors] = useState<Record<string,string>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return <div className="border-zinc-800 bg-zinc-900 w-80 h-64 rounded-md relative">

          <div>
            <button title="close" className="absolute right-2 top-2 cursor-pointer" onClick={()=>{
              closeRoom();
            }}>
              
              <Cross className="text-red-700 font-bold"/>
            </button>
          </div>

          <div className="text-white text-3xl font-bold text-center m-5">
            Create Room
          </div>

          <div className="flex flex-col gap-3 items-center mt-10">
            <InputWrapper error={errors.name}>
              <Input placeholder="Room Name" type="text" ref={nameRef} />
            </InputWrapper>
          </div>

          <div className="flex flex-col items-center mt-5 gap-3">
            <Button
              variant="secondary"
              size="medium"
              text="Create Room"
              auth={true}
              onClick={async () => {
                const slug = nameRef.current?.value;

                const roomData = {
                  name : slug
                };

                const result = RoomSchema.safeParse(roomData);

                if (!result.success) {
                  const fieldErrors = result.error.flatten().fieldErrors;

                  setErrors({
                    name: fieldErrors.name?.[0] ?? ""
                  });

                  return;
                }

                try{
                  const response = await axios.post(
                    `${BACKEND_URL}/room`,
                    roomData,
                    {
                      headers : {"Authorization" : localStorage.getItem('token')}
                    }
                  );
                  router.push(`/room/${roomData.name}`);
                }
                catch(error){
                  if(axios.isAxiosError(error)){
                    setErrors({
                      name : error.response?.data.message
                    })
                  }
                  else{
                    setErrors({
                      name : "Unexpected Error"
                    })
                  }

                }
              }}
            />
          </div>
        </div>
}