import { temp_JWT, WS_URL } from "@repo/common/config";
import { useEffect, useState } from "react";

export function useSocket(){
  const [loading,setLoading] = useState(true);
  const [socket,setSocket] = useState<WebSocket>();


  useEffect(()=>{
    const ws = new WebSocket(`${WS_URL}?token=${temp_JWT}`);

    ws.onopen = ()=>{
      setSocket(ws);
      setLoading(false);
    }

  },[])

  return {loading,socket};
}