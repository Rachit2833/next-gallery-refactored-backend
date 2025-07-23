"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Download, ListFilter } from "lucide-react"
import DrawerClick from "./DrawerClick"
import Filter from "./Filter"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useUser } from "../_lib/context"
import { saveAs } from "file-saver"
import { useToast } from "@/hooks/use-toast";
import RefreshButton from "./RefreshButton"





function SideFilterLayout({ year, text, formType }) {
   const router = useRouter();
   const { toast } = useToast()
   const { selectedImages, setSelectedImages } = useUser();
   const searchParams = useSearchParams();
   function handleSortChange(value) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", value); // "-1" or "1"
      router.push(`${pathname}?${params.toString()}`);
   }

   const pathname = usePathname()
   const filterArray = [
      { label: "All", value: "All" },
      { label: "2024", value: 2024 },
      { label: "2023", value: 2023 },
      { label: "2022", value: 2022 },
   ];
   const handleDownload = async () => {
      if (selectedImages.length <= 0) {
         toast({
            title: "No Images Selected",
            description: "Please select Images to Download",
         });
         return
      }
      toast({
         title: "Preparing download...",
         description: "Your download will start shortly.",
      });

      selectedImages.forEach((item) => {
         try {
            saveAs(item?.url, Date.now().toString());
            toast({
               title: "Download started!",
               description: "Your file is being downloaded.",
            });
         } catch (error) {
            toast({
               title: "Download failed",
               description: "There was an error starting your download.",
            });
         }
      })
   };

   return (
      <>
         
         {pathname !== "/memory-map" && pathname !== "/post" ?
            <>
               <Filter
                  paramName="year"
                  values={filterArray}
                  defaultValue="All"
                  year={year}
               />
               <div className="ml-auto flex items-center gap-2">
                  <RefreshButton />
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

                  <DropdownMenuContent>
                     <DropdownMenuCheckboxItem
                        checked={searchParams.get("sort") === "_id"}
                        onClick={() => handleSortChange("_id")}
                     >
                        Oldest to Newest
                     </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem
                        checked={
                           searchParams.get("sort") === "-_id" || searchParams.get("sort") === null
                        }
                        onClick={() => handleSortChange("-_id")}
                     >
                        Newest to Oldest
                     </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
               </DropdownMenu>

               <Button onClick={handleDownload} size="sm" variant="outline" className="h-7 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                     Download
                  </span>
               </Button>
               <DrawerClick name={text} formType={formType} />
            </div></> : null
}
      </>
   )
}

export default SideFilterLayout
