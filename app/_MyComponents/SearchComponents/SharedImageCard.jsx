"use client"
import img from "@/public/Images/dune.jpg";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Check, CheckIcon, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from 'react-dom';

import { deleteSharedImages } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


function SharedImageCard({ sharedData, image, toggleFav}) {
   const cardRef = useRef(null);

   const [selectedImages, setSelectedImages] = useState([])
   const currentPath = usePathname();
   const { setIsImageOpen, modelImages, setModelImages,   handleDownload } = useUser();
   function logTimeDifference(dateString) {
      const now = new Date(); // Current date and time
      const pastDate = new Date(dateString); // Date to compare with

      // Calculate time difference in milliseconds
      const diffMillis = now - pastDate;

      // Convert milliseconds into units
      const diffSeconds = Math.floor(diffMillis / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      // Determine which log message to display
      if (diffHours < 1 || diffDays === 0) {
         return "Added recently";
      } else if (diffDays === 1) {
         return "Added yesterday";
      } else if (diffDays > 1 && diffDays <= 2) {
         return `Added ${diffDays} days ago`;
      } else if (diffDays > 2) {
         return `Added ${diffDays} days ago`;
      } else {
         return `More than  ${diffDays} days ago`;
      }
   }
   

   return (
      <div onDoubleClick={
         () => {
            if (selectedImages.includes(image._id)) {
               setSelectedImages(selectedImages.filter((id) => id !== image._id));
            } else {
               setSelectedImages([...selectedImages, image._id]);
            }
         }} ref={cardRef} className={` transition-colors duration-100 ease-in-out mx-auto relative ${image?.Favourite ? "bg-[#e3d380]" : "bg-white"} ${selectedImages.includes(image._id) ? "border-[#4169e1] border-4" : null} rounded-lg shadow-md p-4 w-full max-w-xs lg:max-w-sm`}>
         {selectedImages.includes(image._id) ? <Button className={`absolute top-[-1rem] rounded-full h-8 w-8 p-0 m-0 ${selectedImages.includes(image._id) ? "bg-white border-[#4169e1] text-[#4169e1] border-4" : "bg-transparent border-black border-2 "} text-black   z-10 font-[2rem] hover:bg-white right-[-1rem]`}>{selectedImages.includes(image._id) ? <CheckIcon /> : <Plus />}</Button> : null}
         <div
            className="relative w-full h-[15rem] bg-gray-200 rounded-t-lg cursor-pointer overflow-hidden"
            onClick={() => {
               setIsImageOpen(true)
               setModelImages(image?.ImageUrl)
            }
            }

         >
            <Image
               src={image?.ImageUrl === "https://.com/image1.jpg" || !image?.ImageUrl ? img : image?.ImageUrl}
               alt="Placeholder"
               layout="fill"
               objectFit="cover"
               className="rounded-t-lg"
               loading="lazy"
               placeholder="blur"
               blurDataURL={image.blurredImage || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AP/y32tmWQAKBQCbl4tiaWVNUkwA5b+j59jIjYFvAP/cttGqjP/1zX6tFYZ44x69AAAAAElFTkSuQmCC dgfg "}
            />
         </div>
         <ContextMenu>
            <ContextMenuTrigger>
               <div className="overflow-y-auto max-h-24 mt-2">
                  <div className="flex  justify-between">
                     <CardDescription>{image?.Location?.name}</CardDescription>
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger>
                              <Avatar className={`h-8 w-8 object-cover transition-all duration-300 `} >
                                 <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                 <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>shared By {image?.sharedBy?.name} </p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </div>
                  <p className="heading">{image?.Description}</p>
                  <div className="text-xs   text-gray-500 mt-2  flex justify-between items-center">
                     <p> By{" "}
                        <span className="font-semibold hover:cursor-pointer">
                           Author Name
                        </span>{" "}
                        {logTimeDifference("2024-09-29T10:00:00")}
                     </p>

                  </div>

               </div>
               <ContextMenuContent>
                  <ContextMenuItem onClick={()=>handleDownload(image?.ImageUrl)}>Download</ContextMenuItem>
                  <ContextMenuItem>Share</ContextMenuItem>
                  <AlertDialog>
                     <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full ">
                        {`/${currentPath.split("/")[1]}` === "/albums"
                           ? "Remove From Album"
                           : "Delete"}
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this Image
                              from our servers.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <form action={() => deleteSharedImages(sharedData, localStorage.getItem('userId'))} >
                              <input type="hidden" value={image?._id} name="imageId" />
                              <AlertDialogCancel className=" mx-2">Cancel</AlertDialogCancel>
                              <Deletebutton />
                           </form>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
                  <form action={toggleFav} >
                     <input type="hidden" value={image?._id} name="imageId" />
                     <input type="hidden" value={image?.Favourite} name="favValue" />
                     <ContextMenuItem><button className=" flex justify-end align-middle" type="submit">Favourite {image?.Favourite ? <span className=" ml-4"><Check /></span> : null}</button></ContextMenuItem>
                  </form>
               </ContextMenuContent>
            </ContextMenuTrigger>
         </ContextMenu>
      </div>
   );
}

export default SharedImageCard;
export function Deletebutton({ text }) {
   const { pending } = useFormStatus()
   return (
      <>
         <Button type="submit" disabled={pending} >{text || "Continue"} </Button>

      </>
   )
}



