"use client";
import imgs from "@/public/Images/dune.jpg";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Earth } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { saveNewImage } from "../_lib/actions";
import { useUser } from "../_lib/context";
import { Deletebutton } from "./ImageCard";

function getSeason() {
   const now = new Date();
   const month = now.getMonth();
   const year = now.getFullYear();
   let season;
   if (month === 11 || month <= 1) {
      season = "Winter";
   } else if (month >= 2 && month <= 4) {
      season = "Spring";
   } else if (month >= 5 && month <= 7) {
      season = "Summer";
   } else {
      season = "Fall";
   }
   return `${season} ${year}`;
}

function Uploadcard({ setDrawerOpen, fileInput = true, onClick, urlBlob, people = [] }) {
   const [file, setFile] = useState();
   const [fileBlob, setFileBlob] = useState();
   const descriptionPlaceholder = getSeason();
   const { location, setLocation, lat, long, isPending, getCoordinates } = useUser();

   async function urlToBlob(url) {
      try {
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
         }
         return await response.blob();
      } catch (error) {
         console.error("Error converting URL to Blob:", error);
      }
   }

   const handleLocationBlur = (e) => {
      setLocation(e.target.value);
   };

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
      <>
         <div className="w-[80%] lg:w-[40%] mx-auto">
            <DrawerHeader>
               <DrawerTitle className="text-center">Select Images from your Local Storage</DrawerTitle>
               <DrawerDescription className="text-center">
                  Description and Location can be Editable from the Input Fields Below
               </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
               <div className="mx-auto bg-white rounded-lg shadow-md md:p-4 p-2 m-2 w-full max-w-xs lg:max-w-sm">
                  <div className="bg-gray-200 rounded-t-lg cursor-pointer">
                     <Image
                        width={352}
                        height={0}
                        src={fileInput && file ? file : urlBlob || imgs}
                        alt="Placeholder"
                        className="w-full h-[15rem] object-cover rounded-t-lg"
                     />
                  </div>
                  <div className="max-h-24 mt-2">
                     <form className="grid grid-cols-6 gap-4" onSubmit={getCoordinates}>
                        <Input
                           className="col-span-5 h-6 border-none my-2"
                           name="LocationName"
                           onChange={handleLocationBlur}
                           value={location}
                        />
                        {!isPending ? <Earthbutton /> : (
                           <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                        )}
                     </form>

                     <Input
                        name="Description"
                        className="heading cursor-pointer h-8 !text-[1.25rem]"
                        defaultValue={descriptionPlaceholder}
                     />

                     <div className="text-xs text-gray-500 mt-4 sm:block hidden">
                        By <span className="font-semibold hover:cursor-pointer">Author Name</span> 4 days ago
                     </div>
                  </div>
               </div>

               <form action={onSubmit} className="grid w-full items-center gap-1.5">
                  {fileInput && (
                     <Input
                        name="photo"
                        onChange={(e) => {
                           if (e.target.files[0]) {
                              setFile(URL.createObjectURL(e.target.files[0]));
                              setFileBlob(e.target.files[0]);
                           }
                        }}
                        className="border border-input bg-transparent h-9 flex w-full rounded-md file:h-9 file:bg-primary file:text-white file:text-sm file:font-medium"
                        type="file"
                        id="picture"
                     />
                  )}
                  <input name="LocationName" value={location || ""} className=" hidden" readOnly />
                  <input name="lat" value={lat || ""} className=" hidden" readOnly />
                  <input name="long" value={long || ""} className=" hidden" readOnly />
                  <input name="Country" value="India" className=" hidden" readOnly />
                  <Deletebutton text={"Submit"} />
                  <DrawerClose
                     onClick={() => setDrawerOpen(false)}
                     className="border-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-white text-black shadow"
                  >
                     Cancel
                  </DrawerClose>
               </form>
            </DrawerFooter>
         </div>
      </>
   );
}

export default Uploadcard;

export function Earthbutton({ type }) {
   const { pending } = useFormStatus();

   return (
      <Button type={type || "submit"} disabled={pending} className="disabled:bg-white disabled:text-black">
         <Earth />
      </Button>
   );
}
