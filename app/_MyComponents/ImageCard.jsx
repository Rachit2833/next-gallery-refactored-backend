"use client"
import img from "@/app/dune.jpg";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, } from "@/components/ui/context-menu";
import { saveAs } from 'file-saver';
import { Check, CheckIcon, MoveRight, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useFormStatus } from 'react-dom';
import { deleteImagesAction, updateFavourite, updateImageForLabel } from "../_lib/actions";
import { useUser } from "../_lib/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
function ImageCard({ image, text, editSelection, name }) {
   const fallbackBlurredBase64 = "data:image/jpeg;base64,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"
   const abc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="

   const cardRef = useRef(null);
   const currentPath = usePathname();
   const { setIsImageOpen, modelImages, setModelImages, selectedImages, setSelectedImages, isTest, setIsTest } = useUser();

   function onSelect() {
      if (selectedImages.includes(image?._id)) {
         setSelectedImages(selectedImages.filter((id) => id !== image?._id));
      } else {
         setSelectedImages([...selectedImages, image?._id]);
      }
   }
   return (
      <div
         onClick={() => {
            setIsTest(image?._id)
         }}
         onDragStart={(e) => {
            setIsTest(image?._id)
         }}
         onDoubleClick={onSelect} ref={cardRef} className={` transition-colors duration-100 ease-in-out mx-auto relative ${image?.Favourite ? "bg-[#e3d380]" : "bg-white"} ${selectedImages.includes(image?._id) ? "border-[#4169e1] border-4" : null} rounded-lg shadow-md p-4 w-full max-w-xs lg:max-w-sm`}>
         {selectedImages.includes(image?._id) ? <Button className={`absolute top-[-1rem] rounded-full h-8 w-8 p-0 m-0 ${selectedImages.includes(image?._id) ? "bg-white border-[#4169e1] text-[#4169e1] border-4" : "bg-transparent border-black border-2 "} text-black   z-10 font-[2rem] hover:bg-white right-[-1rem]`}>{selectedImages.includes(image?._id) ? <CheckIcon /> : <Plus />}</Button> : null}
         <div
            style={{
               backgroundImage: `url(${image.blurredImage || abc})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            }}
            className="relative select-none w-full lg:h-[15rem]  sm:h-[12rem] h-[8rem] rounded-t-lg cursor-pointer overflow-hidden"
            onClick={() => {
               setIsImageOpen(true);
               setModelImages(image);
            }}
         >
            <Image
               src={image?.ImageUrl === "https://example.com/image1.jpg" || !image?.ImageUrl ? img : image?.ImageUrl}
               alt="Placeholder"
               fill
               objectFit="contain"
               className="rounded-t-lg "
               quality={10}
               loading="lazy"
               placeholder="blur"
               blurDataURL={image.blurredImage || abc}

            />
         </div>

         <ContextMenu>
            <ContextMenuTrigger>
               <div className="overflow-y-auto max-h-24 mt-2">
                  <CardDescription>{image?.Location?.name}</CardDescription>
                  <p className="heading">{image?.Description}</p>
                  <div className="text-xs  text-gray-500 mt-4 sm:block hidden">
                     <p> By{" "}
                        <span className="font-semibold hover:cursor-pointer">
                           Author Name
                        </span>{" "}
                        {logTimeDifference("2024-09-29T10:00:00")}</p>
                  </div>
               </div>
               <ContextMenuContent>
                  <ContextMenuItem onClick={() => saveAs("data:image/jpeg;base64,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", "Dune.png")}>Download</ContextMenuItem>
                  {editSelection ? <AlertDialog>
                     <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                        Set to Cover Image
                     </AlertDialogTrigger>

                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>This image will be set as the person’s cover image</AlertDialogTitle>
                           <AlertDialogDescription>
                              This action will affect the profile of the person across the entire application.
                           </AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* Avatar Transition Block */}
                        <div className="flex items-center justify-between px-4 py-4 bg-muted rounded-md">
                           {/* Current Avatar */}
                           <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                 <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                 <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground truncate max-w-[120px] overflow-hidden whitespace-nowrap">{name?.label || "Unnamed"}</span>
                           </div>

                           {/* Transition Icon */}
                           <MoveRight className="text-gray-400" />

                           {/* New Avatar */}
                           <div className="flex items-center gap-3">
                              <Avatar className="h-12 relative w-12">
                                 <Image priority fill src={image.ImageUrl} placeholder={image.blurredImage} alt="@shadcn" />
                              </Avatar>
                              <span className="text-sm text-primary font-medium truncate max-w-[150px] overflow-hidden whitespace-nowrap">{name?.label || "Unnamed"}</span>
                           </div>
                        </div>

                        <AlertDialogFooter>
                           <form action={updateImageForLabel} >
                              <input type="hidden" value={name?._id} name="labelId" />
                              <input type="hidden" value={image.ImageUrl} name="imageUrl" />
                              <AlertDialogCancel className="mx-2">Cancel</AlertDialogCancel>
                              <Deletebutton />
                           </form>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>

                     : null}
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
                           <form action={deleteImagesAction} >
                              <input type="hidden" value={image?._id} name="imageId" />
                              <AlertDialogCancel className=" mx-2">Cancel</AlertDialogCancel>
                              <Deletebutton />
                           </form>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
                  <form action={updateFavourite} >
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

export default ImageCard;
export function Deletebutton({ text }) {
   const { pending } = useFormStatus()
   return (
      <>
         <Button type="submit" disabled={pending} >{text || "Continue"} </Button>

      </>
   )
}


