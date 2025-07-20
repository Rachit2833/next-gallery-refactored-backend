import { cookies } from "next/headers"
import ImageCard from "../ImageCard"

async function MapSideImages({search}) {
   const cookieStore = cookies()
    let res = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image/loc?cod=${search}`,{
       headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookieStore.get("session").value}`,
       },
    })
     let data = await res.json()


   return (
      <div className="grid grid-cols-2 gap-4">
        {data.images.map((image,i)=>{
         return (
             <ImageCard key={i} image={image} />
             )})}
      </div>
   )
}

export default MapSideImages
