"use client"

import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useUser } from "../_lib/context"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function PagePagination({ totalPagesLeft }) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const { selectedImages } = useUser()

   const currentPage = parseInt(searchParams.get("page") || "1", 10)

   function handleParams(paramName, value) {
      const params = new URLSearchParams(searchParams.toString())
      params.set(paramName, value.toString())
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
   }

   if (selectedImages.length > 0) return null

   const buttonClasses =
      "h-10 min-w-[40px] flex items-center justify-center rounded-md transition-colors"
   const disabledButtonClasses =
      "pointer-events-none opacity-50 bg-muted text-muted-foreground"

   return (
      <Pagination className="sticky bottom-6 z-10 w-full">
         <PaginationContent
            className="p-3 bg-muted border rounded-xl shadow-sm flex-nowrap overflow-x-auto whitespace-nowrap space-x-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
         >
            {/* Previous Icon Button */}
            <PaginationItem
               onClick={() =>
                  currentPage > 1 && handleParams("page", currentPage - 1)
               }
               className={`${buttonClasses} ${
                  currentPage === 1
                     ? disabledButtonClasses
                     : " text-primary-foreground hover:bg-primary/90"
               }`}
            >
               <ChevronLeft className="w-4 h-4" />
            </PaginationItem>

            {/* Current Page */}
            <PaginationItem className={buttonClasses}>
               <PaginationLink
                  isActive
                  href="#"
                  className="h-10 px-3 bg-primary text-primary-foreground font-semibold"
               >
                  {currentPage}
               </PaginationLink>
            </PaginationItem>

            {/* Page +1 */}
            <PaginationItem
               onClick={() =>
                  totalPagesLeft >= 1 && handleParams("page", currentPage + 1)
               }
               className={`${buttonClasses} ${
                  totalPagesLeft < 1
                     ? disabledButtonClasses
                     : "bg-muted text-foreground hover:bg-muted/70"
               }`}
            >
               <PaginationLink href="#">{currentPage + 1}</PaginationLink>
            </PaginationItem>

            {/* Page +2 (Only on sm and up) */}
            {totalPagesLeft >= 2 && (
               <PaginationItem
                  onClick={() => handleParams("page", currentPage + 2)}
                  className={`hidden sm:flex ${buttonClasses} bg-muted text-foreground hover:bg-muted/70`}
               >
                  <PaginationLink href="#">{currentPage + 2}</PaginationLink>
               </PaginationItem>
            )}

            {/* Ellipsis (Only on sm and up) */}
            {totalPagesLeft >= 3 && (
               <PaginationItem
                  className={`hidden sm:flex ${buttonClasses} ${disabledButtonClasses}`}
               >
                  <PaginationEllipsis className="text-muted-foreground" />
               </PaginationItem>
            )}

            {/* Next Icon Button */}
            <PaginationItem
               onClick={() =>
                  totalPagesLeft >= 3 && handleParams("page", currentPage + 3)
               }
               className={`${buttonClasses} ${
                  totalPagesLeft < 3
                     ? disabledButtonClasses
                     : "bg-primary text-primary-foreground hover:bg-primary/90"
               }`}
            >
               <ChevronRight className="w-4 h-4" />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   )
}
