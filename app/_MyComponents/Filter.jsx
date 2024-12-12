"use client"
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


function Filter({values,paramName,defaultValue,year}) {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const router = useRouter()
   const [activeFilter,setActiveFilter]=useState(year||defaultValue)
   useEffect(()=>{
     if(!year){
        handleParams("All")
     }
   },[])
   function handleParams(filter) {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams);
      params.set(paramName, filter);
      router.replace(`${pathname}?${params}`, { scroll: false });
   }
   return (
      <>
         {values.map((item, i) => {
            const isActive = year==="All"? item.value===year :  Number(item.value) === Number(activeFilter); 
            return (
               <Button
                  size="sm"
                  className={`${isActive ? "bg-black text-white" : "bg-white text-black"
                     } hover:text-white hover:bg-black`}
                  key={i}
                  onClick={() => {
                     handleParams(item.value);
                     setActiveFilter(item.value);
                  }}
               >
                  {item.label}
               </Button>
            );
         })}
      </>
   );
}

export default Filter

