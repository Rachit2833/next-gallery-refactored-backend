import { cookies } from "next/headers";
import ImageCard from "../ImageCard";
async function PeopleImage({ name }) {
console.log(name._id,"jjjkkjk")
   const cookieStore = await cookies()
   const data = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image?frId=${name._id}`,{
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
               <ImageCard key={index} editSelection={true} name={name} image={item} />
            ))
         }

      </div>
   )
}

export default PeopleImage
