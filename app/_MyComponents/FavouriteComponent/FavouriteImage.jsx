import { cookies } from "next/headers";
import ImageCard from "../ImageCard";
import { CloudCog } from "lucide-react";
import FavouriteGridWrapper from "../FavouriteGridWrapper";
async function FavouriteImage({param}) {
   console.log(param.year,"sfjb");
   const cookieStore = await cookies()
   const data = await fetch(`http://localhost:2833/image?favourite=true&year=${param.year}`,{
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   })
   const res =  await data.json()
   console.log(res,"fss");

   return (
      
            <FavouriteGridWrapper res={res} />
   )
}

export default FavouriteImage
