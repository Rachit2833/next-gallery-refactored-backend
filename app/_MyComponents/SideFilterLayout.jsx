"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Download, ListFilter } from "lucide-react"
import DrawerClick from "./DrawerClick"
import Filter from "./Filter"
import { usePathname } from "next/navigation"

function SideFilterLayout({year,text,formType}) {

   const pathname = usePathname()
   const filterArray = [
      { label: "All", value: "All" },
      { label: "2024", value: 2024 },
      { label: "2023", value: 2023 },
      { label: "2022", value: 2022 },
   ];
   return (
      <>
         {pathname !== "/memory-map" && pathname !=="/post" ?
          <>
          <Filter
            paramName="year"
            values={filterArray}
            defaultValue="All"
            year={year}
         />
            <div className="ml-auto flex items-center gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1"
                     >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                           Filter
                        </span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuCheckboxItem checked>
                        Oldest to Newest
                     </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem>
                        {" "}
                        Newest to Oldest
                     </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <Button size="sm" variant="outline" className="h-7 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                     Download
                  </span>
               </Button>
               <DrawerClick name={text} formType={formType} />
            </div></> :null}
      </>
   )
}

export default SideFilterLayout
