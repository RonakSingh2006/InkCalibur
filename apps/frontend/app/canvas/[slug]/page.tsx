import Canvas from "@/components/Canvas";

export default async function RoomCanvas({params} : {params : Promise<{slug : string}>}){

  const {slug} = await params;

  return <Canvas slug={slug}/>
} 

