import { cookies } from "next/headers";
import ImageCard from "../ImageCard";
import PeopleWrapper from "./PeopleWrapper";
async function PeopleImage({ name,param }) {
console.log(name._id,"jjjkkjk")
   const cookieStore = await cookies()
   const data = await fetch(`http://localhost:2833/image?frId=${name._id}&year=${param.year}&sort=${param.sort}&page=${param.page}`,{

      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   })
   const res =  await data.json()
   console.log(res,"fss");

   return (



        <PeopleWrapper name={name} res={res} />


   )
}

export default PeopleImage
