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

function AddAlbumForm({ name }) {
   const [isOpen, setIsOpen] = useState(false);
   const [isPending, startTransition] = useTransition();

   async function handleSubmit(formData) {
      // Using `startTransition` to ensure state updates after server action
      await createNewAlbum(formData); // Call the server action with formData
      startTransition(() => {
         setIsOpen(false); // Close the drawer after server action completes
      });

   }

   return (
      <div>
         <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger
               onClick={() => setIsOpen(true)}
               className="h-7 px-3 text-xs gap-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
               <PlusCircle className="h-3.5 w-3.5" />
               {name}
            </DrawerTrigger>
            <DrawerContent>
               <div className="w-[80%] lg:w-[40%] mx-auto">
                  <DrawerHeader>
                     <DrawerTitle className="text-center">
                        Create New Albums And Share with Family & Friends
                     </DrawerTitle>
                     <DrawerDescription className="text-center">
                        Description and Location can be Editable from the Input Fields Below
                     </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                     <form action={handleSubmit}>
                        <div className="grid w-full grid-cols-2 items-center gap-1.5">
                           <div className="col-span-2">
                              <Label htmlFor="Title">Title</Label>
                              <Input
                                 required
                                 name="Title"
                                 className="w-full"
                                 id="Title"
                                 placeholder="Title or Name of the Album in 15 characters or less"
                                 type="text"
                              />
                           </div>
                           <div className="col-span-2">
                              <Label htmlFor="Description">Description</Label>
                              <Input
                                 name="Description"
                                 className="w-full"
                                 id="Description"
                                 placeholder="Describe your Album (Optional)"
                                 type="text"
                              />
                           </div>
                           <div className="col-span-2">
                              <Label htmlFor="Cover-Image">Cover Image</Label>
                              <Input
                                 name="Cover-Image"
                                 className="w-full"
                                 id="Cover-Image"
                                 type="file"
                              />
                           </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 justify-center">
                           <Button type="submit" className="w-full">
                              {isPending ? "Creating..." : "Submit"}
                           </Button>
                        </div>
                     </form>
                  </DrawerFooter>
               </div>
            </DrawerContent>
         </Drawer>
      </div>
   );
}

export default AddAlbumForm;
