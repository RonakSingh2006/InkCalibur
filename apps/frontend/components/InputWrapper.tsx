import { ReactNode } from "react";

export default function InputWrapper({children,error} : {children : ReactNode , error : string}){
  return<div className="h-16 flex flex-col justify-center relative">
        {children}

        {error && <div className="absolute z-2 top-15 w-72">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>}
    </div>
}