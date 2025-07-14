'use client';
import { handleGroupLeave } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, Search } from "lucide-react";
import Image from "next/image";
import bg from "./bg.jpg";
import { set } from "zod";
import GroupInfo from "../SearchComponents/GroupInfo";
import { useRef, useState } from "react";
import gsap from "gsap";
import LeaveDialog from "../SearchComponents/LeaveDialog";

function ChatHeader({ }) {
   const title="Are you sure to leave this group?"
   const description="This will remove you from this group and this action cannot be undone "
   const { isSelected, setIsSelected, isInfoOpen, setIsInfoOpen, infoRef,contentRef } = useUser()
   const groupId=isSelected?._id
   async function handleAction(){
         await handleGroupLeave(localStorage.getItem('userId'), groupId)
         setIsSelected(null)
   }

   return (
      isSelected && !isInfoOpen?<>
         <CardHeader ref={contentRef}   className="bg-green-400 flex flex-row justify-between p-4 rounded-sm">
            <div onClick={() => setIsInfoOpen(true)} className="  cursor-pointer flex items-center  gap-3">
               <Image src={bg} className="h-12 w-12 rounded-full" alt="image " height={48} width={48} />
               <div className=" flex flex-col gap-1">
                  <CardTitle>{isSelected?.name}</CardTitle>
                  <CardDescription>Start a conversation.</CardDescription>
               </div>
            </div>
            <div className="flex gap-4 items-center">
               <Search />
               <Popover>
                  <PopoverTrigger>
                     <EllipsisVertical />
                  </PopoverTrigger>
                  <PopoverContent className="w-[15rem]">
                     <ul className=" cursor-pointer">
                        <li onClick={() => {
                           setIsInfoOpen(true)

                        }} className="my-2">{isSelected.admin ? "Group Info" : "User Info"}</li>
                        <Separator />
                        <li onClick={() => {
                        }} className="my-2">Settings</li>
                        <Separator />
                        <LeaveDialog title={title} description={description} action={handleAction}  groupId={groupId}>
                           <DialogTrigger className="py-2 text-red-500">
                              Leave Group
                           </DialogTrigger>
                        </LeaveDialog>
                     </ul>
                  </PopoverContent>
               </Popover>
            </div>

         </CardHeader> 
      </>:null
   )
}

export default ChatHeader
