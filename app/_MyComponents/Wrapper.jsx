"use client"

import { Download, ListFilter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import DrawerClick from "./DrawerClick"
import MainSlide from "./MainSlide"
import SideFilterLayout from "./SideFilterLayout"

function Wrapper({ card, searchYear }) {

   const searchParams = useSearchParams()
   const pathname= usePathname()
   const router = useRouter()
    function handleParams(filter) {
       if (!searchParams) return; // Ensure searchParams are loaded

       const params = new URLSearchParams(searchParams);
       params.set("year", filter);

       router.replace(`${pathname}?${params}`, { scroll: false });
    }

   return (
     
        <>
         <div className="flex items-center">

            <SideFilterLayout year={searchYear} />
         </div>
         <MainSlide searchYear={searchYear} card={card}  />
         </>


   )
}

export default Wrapper
