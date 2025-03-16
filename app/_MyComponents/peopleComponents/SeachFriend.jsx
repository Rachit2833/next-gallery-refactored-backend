'use client';
import { useUser } from "@/app/_lib/context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react";
import { set } from "zod";

function SeachFriend({ group,item, }) {
   const { setIsSelected, activeUser, isSelected, groupMenu, selectedInGroup, setSelectedInGroup } = useUser();
   const id = item.userId._id !== localStorage.getItem("userId") ? item.userId._id : item.friendId._id 
   const searchParams = useSearchParams()
   const paramValue = searchParams.get("selected");
   const [isChecked ,setIsChecked]=useState(false)
   const pathName = usePathname()
   const router = useRouter()
      function handleParams(filter, filterName) {
         if (!searchParams) return
         const params = new URLSearchParams(searchParams)
         params.set(filterName, filter)
         router.replace(`${pathName}?${params}`, { scroll: false })
      }
    useEffect(()=>{
      if(item._id===paramValue){
         const data = item.userId._id !== localStorage.getItem("userId") ? item.userId : item.friendId 
         setIsSelected(data)
      }
    },[paramValue])
  function onChange(id){
    setIsChecked(!isChecked)
   if(!isChecked){
     setSelectedInGroup([...selectedInGroup,id])
   }else{
     const newData = selectedInGroup.map((val,i)=>{
         return val!==id
    })
      setSelectedInGroup(newData)
   }
  }
   return (
      <>
         <div
            onClick={() =>{
               if(!groupMenu){
                  const data = item.userId._id !== localStorage.getItem("userId") ? item.userId : item.friendId 
                  setIsSelected(data)
                  handleParams(data._id, "id")
               }
               }}
            className={`${isSelected?._id === id&& !groupMenu  ? "bg-green-500" : ""
               } flex mb-2 p-2 gap-2 w-full h-16 items-center`}
         >
            {groupMenu && !group ? <input value={item._id} checked={isChecked} onChange={() => onChange(item._id)} type="checkbox" /> :null}
            <Avatar className={` h-12 w-12 relative object-cover`}>
               {Object.keys(activeUser).includes(item._id) ?<div className="absolute h-4 w-4 rounded-full bg-green-500 z-20 bottom-2 right-2"></div> : null}
               <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
               <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center h-full">
               <h1 className="text-[royalblue] cursor-pointer">
                  {item.userId._id !== localStorage.getItem("userId") ? item.userId.name : item.friendId.name} 
 {/* Fallback if name is not available */}
               </h1>
               <p className="text-slate-500">
                  A million dreams are keepin' me awake
               </p>
            </div>
         </div>
         <Separator />
      </>
   );
}

export default SeachFriend;
