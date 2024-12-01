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
import dynamic from 'next/dynamic';
const FileForm = dynamic(() => import('./FileForm'), {
   ssr: false, // Set this to true or false depending on whether you want server-side rendering
});

import { Button } from "@/components/ui/button"

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

                     <Button>Submit</Button>

                     <DrawerClose className=" border-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-white text-black shadow  " >  Cancel </DrawerClose>

                  </DrawerFooter>
               </div>
            </DrawerContent>
         </Drawer>
      </div>
   )
}

export default DrawerClick
