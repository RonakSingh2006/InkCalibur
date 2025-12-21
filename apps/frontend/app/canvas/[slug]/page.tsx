export default async function Canvas({params} : {params : Promise<{slug : string}>}){

  const {slug} = await params;

  return <div>
      {slug}
  </div>
} 