'use client'

import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import FileForm from "./FileForm"
import { useState } from "react"
import Uploadcard from "./UploadCard"
import AddAlbumForm from "./AlbumsComponent/AddAlbumForm"
import ImageAlbumAddLayout from "./AlbumsComponent/ImageAlbumAddLayout"

function DrawerClick({name,formType="Image"}) {
   const [isDrawerOpen,setDrawerOpen]=useState(false)
   return (
      <div>
         <Drawer open={isDrawerOpen} onOpenChange={()=>setDrawerOpen(!isDrawerOpen)}>
            <DrawerTrigger onClick={()=>setDrawerOpen(true)}  className={`  h-7  px-3 text-xs gap-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`} >
                  <PlusCircle className="h-3.5 w-3.5" />
                     {name}
            </DrawerTrigger>
            <DrawerContent>
                     {formType === "Image" ? <Uploadcard isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} /> : formType === "Album"? <AddAlbumForm  setIsOpen={setDrawerOpen}/>:<ImageAlbumAddLayout />}
            </DrawerContent>
         </Drawer>
      </div>
   )
}

export default DrawerClick
