"use client"


import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { SubmitButton } from "../SignUpForm"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { addUser } from "@/app/_lib/actions"
import { useUser } from "@/app/_lib/context"
function GroupDrawer({inviteId,children,group}) {
   const [isOpen,setIsOpen] =useState(inviteId)
   const router =useRouter()

   return (

      <Drawer open={isOpen}>
         {/* <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
         </DrawerTrigger> */}
         <DrawerContent>
            <div className="mx-auto w-full max-w-[40rem]">
               <DrawerHeader>
                  <DrawerTitle>Group Invite</DrawerTitle>
                  <DrawerDescription>You are invited to join this group,click on join to continue</DrawerDescription>
               </DrawerHeader>
               <div className="p-4 pb-0">
                  {children}
               </div>
               <DrawerFooter className="flex justify-end gap-2">
                <form action={async()=>{
                    const res=  await addUser([localStorage.getItem('userId')], group._id)
                    console.log(res,":res");
                     setIsOpen(false)
                }}>
                     <SubmitButton buttonText="Join" />
                </form>
                  <DrawerClose asChild>
                     <Button onClick={()=>{setIsOpen(false)
                        router.push("/friends")}
                     } variant="outline">Cancel</Button>
                  </DrawerClose>
               </DrawerFooter>

            </div>
         </DrawerContent>
      </Drawer>

   )
}

export default GroupDrawer
