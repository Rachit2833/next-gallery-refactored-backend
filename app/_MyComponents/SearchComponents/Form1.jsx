"use client";
import { useUser } from "@/app/_lib/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Check, Search } from "lucide-react";
import { useState } from "react";
import SelectPeople from "./SelectPeople";
function Form1({ res,  }) {
  
  const users = res.filter((item,i)=>{
      return item._id !== localStorage.getItem("userId")
  })
   return (
      <>
         <div className="relative flex my-4 w-full items-center justify-between">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
               type="search"
               placeholder="Search..."
               className="w-full rounded-lg bg-background pl-8"
            />
         </div>
         <div className="abcd h-[20rem] overflow-y-auto">
            


            <div className="space-y-2 p-4 bg-white">
               <div className="flex mb-2 p-2 gap-2 w-full h-16 items-center">
                  <input type="checkbox" checked={true} readOnly />
                  <Avatar className="h-12 w-12 relative object-cover">
                     <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center h-full">
                     <h1 className="text-[royalblue] cursor-pointer">You</h1>
                  </div>
               </div>
               <Separator />
               {users?.map((item, index) => {
                  console.log(item,":item");
                  return <SelectPeople key={index} item={item} />
               })}
            </div>
         </div></>
   )
}

export default Form1
