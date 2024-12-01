"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


function AlbumFilter() {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const router = useRouter()
   function handleParams(filter) {
      if (!searchParams) return; // Ensure searchParams are loaded

      const params = new URLSearchParams(searchParams);
      params.set("year", filter);

      router.replace(`${pathname}?${params}`, { scroll: false });
   }
   return (

         <TabsList>
            <TabsTrigger onClick={() => handleParams("all")} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => handleParams("2024")} value="2024">2024</TabsTrigger>
            <TabsTrigger onClick={() => handleParams("2023")} value="2023">2023</TabsTrigger>
            <TabsTrigger onClick={() => handleParams("2022")} value="2022" className="hidden sm:flex">
               2022
            </TabsTrigger>
         </TabsList>

   )
}

export default AlbumFilter
