import { cookies } from "next/headers";
import ImageCard from "../ImageCard";
import { CloudCog } from "lucide-react";
async function FavouriteImage() {

   const cookieStore = await cookies()
   const data = await fetch(`http://localhost:2833/image/favourite`,{
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   })
   const res =  await data.json()
   console.log(res,"fss");

   return (
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4">


         {
            res.images?.map((item, index) => (
               <ImageCard key={index} editSelection={true}  image={item} />
            ))
         }

      </div>
   )
}

export default FavouriteImage
