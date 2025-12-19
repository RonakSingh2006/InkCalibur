import ChatRoom from "../../components/ChatRoom";

export default async function Room({params} : {params : Promise<{slug : string}>}){
  const {slug} = await params;
  return <div>
    <ChatRoom slug={slug}></ChatRoom>
  </div>
}