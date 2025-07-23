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
import { useUser } from "../_lib/context"

export function PagePagination({ totalPagesLeft }) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const { selectedImages, setSelectedImages } = useUser()

   const currentPage = parseInt(searchParams.get("page") || "1", 10)

   function handleParams(paramName, filter) {
      const params = new URLSearchParams(searchParams.toString())
      params.set(paramName, filter.toString())
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
   }

   return (
      selectedImages.length <= 0 ? (
         <Pagination className="sticky bottom-6 z-10">
            <PaginationContent className="p-3 bg-muted border rounded-xl shadow-sm space-x-2">

               {/* Previous Button */}
               <PaginationItem
                  onClick={() =>
                     currentPage > 1 &&
                     handleParams("page", currentPage - 1)
                  }
                  className={currentPage === 1
                     ? "pointer-events-none opacity-50"
                     : "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
                  }
               >
                  <PaginationPrevious href="#" />
               </PaginationItem>

               {/* Current Page */}
               <PaginationItem>
                  <PaginationLink
                     isActive
                     href="#"
                     className="bg-primary text-primary-foreground rounded-md font-semibold px-3 py-1"
                  >
                     {currentPage}
                  </PaginationLink>
               </PaginationItem>

               {/* Page +1 */}
               <PaginationItem
                  onClick={() =>
                     totalPagesLeft >= 1 && handleParams("page", currentPage + 1)
                  }
                  className={totalPagesLeft < 1
                     ? "pointer-events-none opacity-50"
                     : "bg-muted text-foreground hover:bg-muted/70 rounded-md"
                  }
               >
                  <PaginationLink href="#">{currentPage + 1}</PaginationLink>
               </PaginationItem>

               {/* Page +2 */}
               <PaginationItem
                  onClick={() =>
                     totalPagesLeft >= 2 && handleParams("page", currentPage + 2)
                  }
                  className={totalPagesLeft < 2
                     ? "pointer-events-none opacity-50"
                     : "bg-muted text-foreground hover:bg-muted/70 rounded-md"
                  }
               >
                  <PaginationLink href="#">{currentPage + 2}</PaginationLink>
               </PaginationItem>

               {/* Ellipsis */}
               <PaginationItem>
                  <PaginationEllipsis className="text-muted-foreground" />
               </PaginationItem>

               {/* Next Button */}
               <PaginationItem
                  onClick={() =>
                     totalPagesLeft >= 3 && handleParams("page", currentPage + 3)
                  }
                  className={totalPagesLeft < 3
                     ? "pointer-events-none opacity-50"
                     : "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
                  }
               >
                  <PaginationNext href="#" />
               </PaginationItem>

            </PaginationContent>
         </Pagination>
      ) : null
   )
}
