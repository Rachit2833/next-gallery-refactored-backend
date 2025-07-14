"use client"
import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, ImageIcon, LineChart, Package, Package2, PanelLeft, Search, ShoppingCart, Users2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useUser } from "../_lib/context"
import BreadCrums from "./BreadCrumb"
import SearchLoader from "./Loaders/SearchLoader"
import { logOutUser } from "../_lib/actions"
function SideSheet() {
   const { searchVal, setSearchVaL, searchData, setSearchData,  queryState, } =useUser()
   const [isLoading, setIsLoading] = useState(false)
   const pathName = usePathname()

   const pathArray = pathName.split("/")
   const searchParams = useSearchParams()
   const router = useRouter()
   const uniqueArray = [...new Set(pathArray)];
   function handleParams(filter, filterName) {
      if (!searchParams) return
      const params = new URLSearchParams(searchParams)
      params.set(filterName, filter)
      router.replace(`${pathName}?${params}`, { scroll: false })
   }
   useEffect(() => {
      if (!searchVal ) {
         setSearchData(null)
         setIsLoading(false)
         return
      }
      async function search() {
         setIsLoading(true)
         const data = await fetch(`http://localhost:2833/image/search/?query=${searchVal}`)
         const res = await data.json()
         setSearchData(res)
         setIsLoading(false)
      }
      search()
   }, [searchVal])
   return (
      pathName !== "/login" && pathName !== "/sign-up" && pathName !== "/not-found" ?<header className = "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
         <Sheet >

            <SheetTrigger asChild>
               <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
               </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-xs">
               <nav className="grid gap-6 text-lg font-medium">
                  <Link
                     href="#"
                     className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                     <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                     <span className="sr-only">Acme Inc</span>
                  </Link>
                  <Link
                     href="#"
                     className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                     <Home className="h-5 w-5" />
                     Dashboard
                  </Link>
                  <Link
                     href="#"
                     className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                     <ShoppingCart className="h-5 w-5" />
                     Orders
                  </Link>
                  <Link
                     href="#"
                     className="flex items-center gap-4 px-2.5 text-foreground"
                  >
                     <Package className="h-5 w-5" />
                     Products
                  </Link>
                  <Link
                     href="#"
                     className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                     <Users2 className="h-5 w-5" />
                     Customers
                  </Link>
                  <Link
                     href="#"
                     className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                     <LineChart className="h-5 w-5" />
                     Settings
                  </Link>
               </nav>
            </SheetContent>
         </Sheet>
         <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>

               {uniqueArray.map((item, i) => {
                  return <React.Fragment key={i}>
                     <BreadCrums href={item === "" ? "/" : `/${item}`} item={item} />
                     {uniqueArray[i + 1] ? <BreadcrumbSeparator /> : null}
                  </React.Fragment>

               })}



            </BreadcrumbList>
         </Breadcrumb>
         <div className={`  p-2 ${searchVal ? "rounded-xl  border bg-card text-card-foreground shadow" : null} top-1  absolute right-6`}>
            <div className="  relative ml-auto flex gap-4  md:grow-0">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input
                  onChange={(e) => {
                     setSearchVaL(e.target.value)
                     handleParams(e.target.value,"query")
                  }}
                  value={searchVal||queryState||""}
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8  md:w-[200px] lg:w-[320px]"
               />
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                     >
                        <Image
                           src="/placeholder-user.jpg"
                           width={36}
                           height={36}
                           alt="Avatar"
                           className="overflow-hidden rounded-full"
                        />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>Settings</DropdownMenuItem>
                     <DropdownMenuItem>Support</DropdownMenuItem>
                     <DropdownMenuSeparator />
                    <form className="p-0 m-0" action={async()=>{
                
                     await logOutUser()
                     router.push("/login")
                     router
                    }}>
                        <button type="submit"><DropdownMenuItem >Logout</DropdownMenuItem></button>
                    </form>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            {isLoading && searchVal ? <SearchLoader /> : <div className={`${searchVal ? null : " hidden"} gap-2  h-[85%] my-2 grid grid-rows-auto`}>
               {searchData?.peopleData?.length!==0 ? <Card className="p-2 ">
                  <CardTitle className="my-2">People</CardTitle>
                  <div className="flex gap-2">
                     {searchData?.peopleData?.map((item,i)=>{
                        return <Badge onClick={()=>{
                           setSearchVaL(item.label)
                           
                           handleParams(item._id,"frId")
                        }} key={i}>{item.label}</Badge>
                     })}
                  </div>
               </Card> :null}
               {searchData?.LocationData?.length!==0 ? <Card className="p-2 ">
                  <CardTitle className="my-2">Location</CardTitle>
                  <div className="flex gap-2">
                     {searchData?.LocationData ? searchData?.LocationData[0]?.Location?.map((item, i) => {
                        return <Badge onClick={()=>{
                           setSearchVaL(item)
                           handleParams(item,"cod")
                        }} key={i}>{item.split(",")[0]}</Badge>
                     }):null}
                  </div>
               </Card> : null}
               {searchData?.DesData?.length !== 0 ?
                  <ScrollArea className=" border bg-card max-h-72 w-full  p-2 ">
                      {searchData?.DesData?.map((item,i)=>{
                         return <div key={i}>
                            <Alert  className="my-1">
                               <ImageIcon className="h-4 w-4" />
                               <AlertTitle>{item.Date.split("T")[0]}</AlertTitle>
                               <AlertDescription>
                                  {item.Description}
                               </AlertDescription>
                            </Alert>
                            <Separator />
                         </div>


                      })}


                  </ScrollArea> : null}



            </div>}


         </div>
      </header >:null
   )
}

export default SideSheet
