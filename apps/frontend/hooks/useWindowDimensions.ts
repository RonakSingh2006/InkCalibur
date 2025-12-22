import { useEffect, useState } from "react"

interface Size{
  width : number,
  height : number
}

export default function useWindowDimensions(){
  const [size,setSize] = useState<Size>({
    width : window.innerWidth,
    height : window.innerHeight
  });

  useEffect(()=>{
    
    function handleSize(){
      setSize({
        width : window.innerWidth,
        height : window.innerHeight
      })
    }

    handleSize();

    window.addEventListener("resize",handleSize);
  },[])

  return {size};
}