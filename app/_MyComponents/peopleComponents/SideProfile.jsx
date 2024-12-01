'use client';

import { updateName } from "@/app/_lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SideProfile({ name }) {
   const [isNameInput, setIsNameInput] = useState(false);

   // Get the path-based ID
   const pathName = usePathname();
   const pathId = pathName.split('/').pop(); // Assumes the ID is at the end of the path

   return (
      <div className="flex p-2 gap-2 lg:w-[35%] md:w-[70%] items-center">
         {isNameInput ? (
            // Edit Name Input
            <Card className="flex p-2 gap-2 w-full h-16 items-center">
               <Avatar className="h-12 w-12 object-cover">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <form onSubmit={()=>{
                  setIsNameInput(false)
               }} className="flex justify-between w-full items-center" action={updateName}>
                  <input
                     defaultValue={name}
                     name="labelName"
                     className="h-full w-full p-2 focus:outline-none focus:border-0"
                     placeholder="New Name or Nickname"
                     type="text"
                  />
                  <input type="hidden" name="id" value={pathId} />
                  <SubmitButton /> {/* Place the button within the form */}
               </form>
            </Card>
         ) : (
            // Display Name Section
            <div className="flex p-2 gap-2 w-full h-16 items-center">
               <Avatar className="h-12 w-12 object-cover">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div className="flex flex-col justify-center h-full">
                  <h1
                     onClick={() => setIsNameInput(true)}
                     className="text-[royalblue] cursor-pointer"
                  >
                     {name || "Unnamed"} {/* Fallback if name is not available */}
                  </h1>
                  <p className="text-slate-500">Find them fast by name with search</p>
               </div>
            </div>
         )}
      </div>
   );
}

export default SideProfile;

export function SubmitButton() {
   const { pending } = useFormStatus();
   return (
      <Button  disabled={pending}  type="submit" variant="outline" size="sm">
         {pending ? "Updating..." : "Done"}
      </Button>
   );
}
