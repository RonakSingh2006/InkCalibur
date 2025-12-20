import { ReactNode } from "react";

export default function InputWrapper({children,error} : {children : ReactNode , error : string}){
  return<div className="min-h-16 flex flex-col justify-center">
          {children}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
}