'use client'

import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useUser} from "../_lib/context"
import { CloudCog } from "lucide-react"

export function PagePagination({ totalPagesLeft }) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const {selectedImages,setSelectedImages}=useUser()

   const currentPage = parseInt(searchParams.get("page") || "1", 10)

   function handleParams(paramName, filter) {
      const params = new URLSearchParams(searchParams.toString())
      params.set(paramName, filter.toString())
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
   }

   return (
     selectedImages.length<=0? <Pagination className="sticky bottom-6">
         <PaginationContent className="p-3 bg-transparent border-2 rounded-xl card-shadow">

            {/* Previous Button */}
            <PaginationItem
               onClick={() =>
                  currentPage > 1 &&
                  handleParams("page", currentPage - 3 < 1 ? 1 : currentPage - 1)
               }
               className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            >
               <PaginationPrevious href="#" />
            </PaginationItem>

            {/* Current Page */}
            <PaginationItem>
               <PaginationLink isActive href="#">
                  {currentPage}
               </PaginationLink>
            </PaginationItem>

            {/* Page +1 */}
            <PaginationItem
               onClick={() =>
                  totalPagesLeft >= 1 && handleParams("page", currentPage + 1)
               }
               className={totalPagesLeft < 1 ? "pointer-events-none opacity-50" : ""}
            >
               <PaginationLink href="#">{currentPage + 1}</PaginationLink>
            </PaginationItem>

            {/* Page +2 */}
            <PaginationItem
               onClick={() =>
                  totalPagesLeft >= 2 && handleParams("page", currentPage + 2)
               }
               className={totalPagesLeft < 2 ? "pointer-events-none opacity-50" : ""}
            >
               <PaginationLink href="#">{currentPage + 2}</PaginationLink>
            </PaginationItem>

            {/* Ellipsis */}
            <PaginationItem>
               <PaginationEllipsis />
            </PaginationItem>

            {/* Next Button */}
            <PaginationItem
               onClick={() =>
                  totalPagesLeft >= 3 && handleParams("page", currentPage + 3)
               }
               className={totalPagesLeft < 3 ? "pointer-events-none opacity-50" : ""}
            >
               <PaginationNext href="#" />
            </PaginationItem>

         </PaginationContent>
      </Pagination>:null
   )
}
