'use client';
import { useUser } from "@/app/_lib/context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import SubTrigger from "./SubTrigger";
import LeaveDialog from "./LeaveDialog";
import { LogOut } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { handleGroupLeave } from "@/app/_lib/actions";


function GroupMembers({ isSelected, item, groupSelection,isAdmin }) {
   const title = "Are you sure to leave this group?"
   const description = "This will remove you from this group and this action cannot be undone "
   const { setIsSelected, activeUser, selectedInGroup, setSelectedInGroup } = useUser();
   const searchParams = useSearchParams();
   const paramValue = searchParams.get("selected");
   const [isChecked, setIsChecked] = useState(false);
   async function handleAction(){
         await handleGroupLeave(localStorage.getItem('userId'), isSelected._id)
         setIsSelected(null)
   }
   function onChange(id) {
      setIsChecked(!isChecked);
      if (!isChecked) {
         setSelectedInGroup([...selectedInGroup, id]);
      } else {
         setSelectedInGroup(selectedInGroup.filter((val) => val !== id));
      }
   }

   return (
      <>
         <div className="flex items-center mb-2 p-2 gap-2 justify-between w-full h-16 relative">
          <div className="flex gap-4">
               {groupSelection && localStorage.getItem("userId") !== item._id? 
                  <input
                     value={item._id}
                     checked={isChecked}
                     onChange={() => onChange(item._id)}
                     type="checkbox"
                     className="ml-2"
                  />
               :null}

               <Avatar className="h-12 w-12 relative object-cover">
                  {Object.keys(activeUser).includes(item._id) && (
                     <div className="absolute h-4 w-4 rounded-full bg-green-500 z-20 bottom-2 right-2"></div>
                  )}
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>

               <div className="flex flex-col justify-center h-full">
                  <h1 className="text-[royalblue] cursor-pointer">
                     {item._id===localStorage.getItem("userId")?"You":item.name || "Unknown"}
                  </h1>
                  <p className="text-slate-500 truncate max-w-[200px]">
                     A million dreams are keepin' me awake
                  </p>
               </div>
          </div>
            {isAdmin && item._id !== localStorage.getItem("userId") ? <SubTrigger selId={item._id} /> : <LeaveDialog  title={title} description={description} action={handleAction} >
               <DialogTrigger className="py-2">
                  <LogOut />
               </DialogTrigger>
            </LeaveDialog>
}
         </div>
         <Separator />
      </>
   );
}

export default GroupMembers;
