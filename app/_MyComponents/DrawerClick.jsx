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

function DrawerClick({name,style}) {
   return (
      <div>
         <Drawer>
            <DrawerTrigger  className={`  h-7  px-3 text-xs gap-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`} >
                  <PlusCircle className="h-3.5 w-3.5" />
{name}
            </DrawerTrigger>
            <DrawerContent>
               <div className="w-[80%] lg:w-[40%] mx-auto">
                  <DrawerHeader >
                     <DrawerTitle className="text-center">Select Images from your Local Storage</DrawerTitle>
                     <DrawerDescription className="text-center">Description and Location can be Editable from the Input Fields Below</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>


                    <FileForm />

                    

                  </DrawerFooter>
               </div>
            </DrawerContent>
         </Drawer>
      </div>
   )
}

export default DrawerClick
