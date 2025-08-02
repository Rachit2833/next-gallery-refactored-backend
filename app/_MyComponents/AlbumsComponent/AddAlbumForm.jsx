'use client'

import { createNewAlbum } from "@/app/_lib/actions";
import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { SubmitButton } from "../SignUpForm";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

function AddAlbumForm({ setIsOpen, }) {
   const { toast } = useToast()
   return (

      <div className="w-[80%] lg:w-[40%]  mx-auto">


         <DrawerHeader>
            <DrawerTitle className="text-center">
               Create New Albums And Share with Family & Friends
            </DrawerTitle>
            <DrawerDescription className="text-center">
               Description and Location can be Editable from the Input Fields Below
            </DrawerDescription>
         </DrawerHeader>
         <DrawerFooter>
            <form action={async (formData) => {
               try {
                  const options = {
                     weekday: "long",
                     year: "numeric",
                     month: "long",
                     day: "numeric",
                     hour: "numeric",
                     minute: "numeric",
                     hour12: true,
                  };
                  const description = new Date().toLocaleString("en-US", options);

                  const res = await createNewAlbum(formData);

                  if (res?.message === "Album Saved") {
                     setIsOpen(false);
                     toast({
                        title: "Album Creating Started",
                        description: description,
                        action: <ToastAction altText="Goto schedule to undo">Done</ToastAction>,
                     });
                  } else {
                     throw new Error(res?.message || "Album creation failed");
                  }
               } catch (error) {
                  console.log(error, "hello");
                  toast({
                     title: "Album Creation Failed",
                     description: error.message || "Something went wrong!",
                     action: <ToastAction altText="Try Again">Retry</ToastAction>,
                  });
               }
            }}>

               <div className="grid w-full grid-cols-2 items-center gap-1.5">
                  <div className="col-span-2">
                     <Label htmlFor="Title">Title</Label>
                     <Input
                        required
                        name="Title"
                        className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                        id="Title"
                        placeholder="Title or Name of the Album in 15 characters or less"
                        type="text"
                     />
                  </div>
                  <div className="col-span-2">
                     <Label htmlFor="Description">Description  <span className="text-xs text-muted-foreground">(optional)</span></Label>
                     <Input
                        name="Description"
                        className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                        id="Description"
                        placeholder="Describe your Album"
                        type="text"
                     />
                  </div>
                  <div className="col-span-2">
                     <Label htmlFor="Cover-Image">
                        Cover Image <span className="text-xs text-muted-foreground">(optional)</span>
                     </Label>
                     <Input
                        name="photo"
                        className=" sm:w-[35rem] mx-auto  w-full px-0 py-0  border  rounded-md bg-muted text-muted-foreground
             file:px-4 file:py-2 file:rounded-none file:border-none file:bg-accent 
             file:text-accent-foreground file:m-0 file:mr-4 file:rounded-l-md file:shadow-none"
                        id="Cover-Image"
                        type="file"
                     />
                  </div>
               </div>

               <div className="mt-4 flex flex-col gap-2 justify-center">
                  <SubmitButton buttonText="Create Album" />
               </div>
            </form>
         </DrawerFooter>
      </div>
   );
}

export default AddAlbumForm;
