'use client';

import { updateName } from "@/app/_lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CloudCog, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SideProfile({ res }) {
   const [isNameInput, setIsNameInput] = useState(false);
   const pathName = usePathname();
   const pathId = pathName.split('/').pop(); // Assumes the ID is at the end of the path
   console.log(res,"res")
   return (
      <div className="flex p-2 gap-2 lg:w-[35%] md:w-[70%] items-center">
         {isNameInput ? (
            // Edit Name Input
            <Card className="flex p-2 gap-2 w-full h-16 items-center">
               <Avatar className="h-12 relative w-12">
                  <Image priority fill src={res.ImageUrl||"https://images.unsplash.com/photo-1750969315593-36b04578208c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"} quality={30} placeholder={res.blurredImage} alt="@shadcn" />
               </Avatar>
               <form className="flex justify-between w-full items-center" action={async(formData)=>{ 
                  await updateName(formData)
                  setIsNameInput(false)
                  }}>
                  <input
                     defaultValue={res.label}
                     name="labelName"
                      className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                     placeholder="New Name or Nickname"
                     type="text"
                  />
                  <input type="hidden" name="id" value={pathId} />
                  <SubmitButton /> {/* Place the button within the form */}
                  <Button onClick={()=> setIsNameInput(false)} type="button"  className="ml-4 h-8" variant="ghost" size="icon"><X/></Button>
               </form>
            </Card>
         ) : (
            // Display Name Section
            <div className="flex p-2 gap-2 w-full h-16 items-center">
               <Avatar className="h-12 relative w-12">
                  <Image priority fill src={res.ImageUrl||"https://images.unsplash.com/photo-1750969315593-36b04578208c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D"} placeholder={res.blurredImage} alt="@shadcn" />
               </Avatar>
               <div className="flex flex-col justify-center h-full">
                  <h1
                     onClick={() => setIsNameInput(true)}
                     className="text-[royalblue] cursor-pointer"
                  >
                     {res.label || "Unnamed"} {/* Fallback if name is not available */}
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
    <Button
      disabled={pending}
      type="submit"
      variant="ghost" // you can also try "default" or "secondary"
      size="sm"
      className="bg-background ml-4 border text-accent-foreground hover:bg-accent/80 disabled:opacity-50"
    >
      {pending ? "Updating..." : "Done"}
    </Button>
  );
}