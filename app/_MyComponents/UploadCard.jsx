"use client";

import imgs from "@/public/Images/dune.jpg";
import { Button } from "@/components/ui/button";
import {
   DrawerClose,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Earth } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveNewImage } from "../_lib/actions";
import { useUser } from "../_lib/context";
import { Deletebutton } from "./ImageCard";
import { Card } from "@/components/ui/card";

function getSeason() {
   const now = new Date();
   const month = now.getMonth();
   const year = now.getFullYear();
   let season;
   if (month === 11 || month <= 1) season = "Winter";
   else if (month >= 2 && month <= 4) season = "Spring";
   else if (month >= 5 && month <= 7) season = "Summer";
   else season = "Fall";
   return `${season} ${year}`;
}

function Uploadcard({
   setDrawerOpen,
   fileInput = true,
   onClick,
   urlBlob,
   people = [],
}) {
   const [file, setFile] = useState();
   const [fileBlob, setFileBlob] = useState();
   const descriptionPlaceholder = getSeason();
   const { location, setLocation, lat, long, isPending, getCoordinates } =
      useUser();

   async function urlToBlob(url) {
      try {
         const response = await fetch(url);
         if (!response.ok) throw new Error(`Failed to fetch file`);
         return await response.blob();
      } catch (error) {
         console.error("Error converting URL to Blob:", error);
      }
   }

   const handleLocationBlur = (e) => setLocation(e.target.value);

   async function onSubmit() {
      const formData = new FormData();

      if (people.length > 0 && !people.includes("unknown")) {
         formData.append("detection", false);
         formData.append("People", JSON.stringify(people));
      } else {
         formData.append("detection", true);
         formData.append("People", JSON.stringify([]));
      }

      if (fileInput) {
         formData.append("photo", fileBlob);
      } else {
         const blob = await urlToBlob(urlBlob);
         formData.append("photo", blob);
      }

      formData.append("LocationName", location);
      formData.append("Country", "India");

      await saveNewImage(formData, localStorage.getItem("userId"));
      setDrawerOpen(false);
   }

   return (
      <div className="w-full px-4 sm:px-6 md:px-10 max-w-xl mx-auto">
         <DrawerHeader>
            <DrawerTitle className="text-center text-base sm:text-lg">
               Select Images from your Local Storage
            </DrawerTitle>
            <DrawerDescription className="text-center text-sm">
               Description and Location can be Editable from the Input Fields Below
            </DrawerDescription>
         </DrawerHeader>

         <DrawerFooter>
            <div className="w-full flex justify-center">
               <Card className="rounded-lg shadow-md p-2 sm:p-4 w-full max-w-md bg-card text-card-foreground">
                  <div className="rounded-t-lg overflow-hidden">
                     <Image
                        width={352}
                        height={240}
                        src={fileInput && file ? file : urlBlob || imgs}
                        alt="Preview"
                        className="w-full h-[15rem] object-cover"
                     />
                  </div>

                  <div className="mt-2 space-y-3">
                     <form
                        className="flex flex-row gap-2 items-center w-full"
                        onSubmit={getCoordinates}
                     >
                        <Input
                           className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                           name="LocationName"
                           onChange={handleLocationBlur}
                           value={location}
                           placeholder="Enter location"
                        />

                        {!isPending ? (
                           <Earthbutton />
                        ) : (
                           <div className="w-9 h-9 border-2 border-border border-t-foreground rounded-full animate-spin" />
                        )}
                     </form>


                     <Input
                        name="Description"
                        className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                        defaultValue={descriptionPlaceholder}
                     />

                     <div className="text-xs text-muted-foreground hidden sm:block mt-4">
                        By{" "}
                        <span className="font-semibold cursor-pointer hover:underline">
                           Author Name
                        </span>{" "}
                        · 4 days ago
                     </div>
                  </div>
               </Card>
            </div>

            <form action={onSubmit} className="mt-6 w-full grid gap-3">
               {fileInput && (
                  <Input
                     name="photo"
                     onChange={(e) => {
                        if (e.target.files[0]) {
                           setFile(URL.createObjectURL(e.target.files[0]));
                           setFileBlob(e.target.files[0]);
                        }
                     }}
                     className="w-full px-0 py-0  border  rounded-md bg-muted text-muted-foreground
             file:px-4 file:py-2 file:rounded-none file:border-none file:bg-accent 
             file:text-accent-foreground file:m-0 file:mr-4 file:rounded-l-md file:shadow-none"
                     type="file"
                     id="picture"
                  />
               )}

               {/* Hidden fields */}
               <input name="LocationName" value={location || ""} className="hidden" readOnly />
               <input name="lat" value={lat || ""} className="hidden" readOnly />
               <input name="long" value={long || ""} className="hidden" readOnly />
               <input name="Country" value="India" className="hidden" readOnly />

               <Deletebutton text={"Submit"} />

               <DrawerClose
                  onClick={() => setDrawerOpen(false)}
                  className="border border-border inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-background text-foreground shadow"
               >
                  Cancel
               </DrawerClose>
            </form>
         </DrawerFooter>
      </div>
   );
}

export default Uploadcard;

export function Earthbutton({ type }) {
   const { pending } = useFormStatus();
   return (
      <Button type={type || "submit"} disabled={pending} className="h-9 px-3">
         <Earth className="w-4 h-4" />
      </Button>
   );
}
