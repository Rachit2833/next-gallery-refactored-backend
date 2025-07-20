
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ChevronDownCircle, ChevronRightCircle, MoveRightIcon, Search } from "lucide-react"
import { cookies } from "next/headers"
import LabelSelector from "./LabelSelector"
import LabelImages from "./LabelImages"
import React from "react"



async function AutoSendMenu({searchParam,children}) {
   const cookieStore = cookies()
   const response = await fetch("https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/labels", {
      headers: {
         "Content-Type": "application/json",
          authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   const people = await response.json();
   console.log(people,"people");
   return (
      <Dialog>
        {children}
         <DialogContent>
            <DialogTitle>Enable Auto Send</DialogTitle>
            <DialogDescription>Select the Image of the Person from the saved images or add new image</DialogDescription>
         <div className="relative flex my-4 w-full items-center justify-between">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
               type="search"
               placeholder="Search..."
               className="w-full rounded-lg bg-background pl-8"
            />
         </div>
         <div className="abcd h-[20rem] overflow-y-auto">



            <div className=" bg-white">
               {people.map((item,index)=>{
                  return(
                  <React.Fragment key={index} >
                     <LabelSelector item={item}>
                           <LabelImages val={cookieStore.get("session").value} query={searchParam} />
                     </LabelSelector>
                     </React.Fragment>
               )})}
                  
               
            </div>
         </div>
         </DialogContent>
         </Dialog>
         

   )
}

export default AutoSendMenu
