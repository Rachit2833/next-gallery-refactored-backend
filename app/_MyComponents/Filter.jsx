"use client"
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


function Filter({values,paramName,defaultValue}) {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const router = useRouter()
   const [activeFilter,setActiveFilter]=useState(defaultValue)

   function handleParams(filter) {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams);
      params.set(paramName, filter);
      router.replace(`${pathname}?${params}`, { scroll: false });
   }
   return (
      <>
         {
            values.map((item, i) => {
               return <Button size="sm" className={`${item.value === activeFilter ? "bg-black text-white" : "bg-white text-black "}  hover:text-white hover:bg-black  `} key={i} onClick={() => {
                  handleParams(item.value)
                  setActiveFilter(item.value)
               }}>{item.label}</Button>
            })
         }
      </>
   )
}

export default Filter

