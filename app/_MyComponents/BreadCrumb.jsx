'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
function BreadCrums({item,href,}) {
   return (
           <>
         <BreadcrumbItem>
            <BreadcrumbLink asChild>
               <Link href={href || "#"}>{item === "" ? "Home" : item.toUpperCase()}</Link>
            </BreadcrumbLink>
         </BreadcrumbItem>

        
         </>
           
       
   )
}

export default BreadCrums
