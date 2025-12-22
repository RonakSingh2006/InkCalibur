import { WS_URL } from "@repo/common/config";
import { useEffect, useState } from "react";

export function useSocket(){
  const [loading , setLoading] = useState(true);
  const [socket,setSocket] = useState<WebSocket>();

  useEffect(()=>{
    const ws = new WebSocket(`${WS_URL}/?token=${localStorage.getItem('token')}`);

    ws.onopen = ()=>{
      setLoading(false);
      setSocket(ws);
    }
  },[])
  
  return {loading,socket};
}