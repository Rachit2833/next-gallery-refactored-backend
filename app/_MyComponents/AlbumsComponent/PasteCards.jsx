"use client"
import { useUser } from "@/app/_lib/context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ImageCard from "../ImageCard";
import PasteModule from "../PasteModule";

function PasteCards({res,cod,frId,query,children}) {
   
   
   const router = useRouter();
   const searchParams = useSearchParams()
   const pathName = usePathname()
   const {  setQueryState, setFetchedImages} = useUser()

   useEffect(()=>{
      console.log("hebjh");
      setFetchedImages(res)
      if(!query){
         const params = new URLSearchParams(searchParams)
         params.delete("cod")
         params.delete("frId")
         params.delete("query")
         router.replace(`${pathName}?${params}`, { scroll: false })
      }
   },[query])
   useEffect(()=>{
      setQueryState(query)
   },[cod,frId,query])

   return (
      <div className="grid md:grid-cols-3 p-4  sm:grid-cols-2 grid-cols-1 gap-4 ">
           {res?.map((item, index)=>{
              return  <ImageCard image={item} key={index} />
           })}

      {/* <PasteModule /> */}
         {children||null}
      </div>
   );
}

export default PasteCards;