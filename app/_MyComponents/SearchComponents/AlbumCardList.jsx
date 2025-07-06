'use client'
import { addImagesToAlbum } from "@/app/_lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { SubmitButton } from "./LeaveDialog";
import { useUser } from "@/app/_lib/context";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

function AlbumCardList({ album }) {
   const { selectedImages, setSelectedImages } = useUser()
   const { toast } = useToast()

   return (
      <div className="grid grid-cols-[auto_1fr]  gap-4 p-4 border rounded-lg shadow-md bg-white">
         {/* Album Cover */}
         <Image
            alt="Album Cover"
            width={128}
            height={160}
            className="rounded-md object-cover h-40 w-32"
            src={album.ImageUrl || "https://plus.unsplash.com/premium_photo-1666739388993-67fec77e2e4d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVzaWMlMjBhbGJ1bSUyMGNvdmVyfGVufDB8fDB8fHww"}
         />

         {/* Album Details */}
         <div className="flex flex-col h-full">
            <h1 className="text-lg font-semibold">{album.Name}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{album.Description}</p>

            {/* Bottom Section */}
            <div className="flex justify-between items-center mt-auto">
               {/* Avatars */}
               <div className="flex">
                  {Array.from({ length: 3 }).map((_, index) => (
                     <Avatar
                        key={index}
                        className="h-8 w-8 mx-[-6px] ring-4 ring-white object-cover transition-all duration-300"
                     >
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                     </Avatar>
                  ))}
               </div>

               {/* Button aligned to the bottom-right */}
               <form
                  action={async () => {
                     try {
                        const res= await addImagesToAlbum(album._id, selectedImages);
                        console.log(res,":res");
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
                        if (res?.addedImages===0){
                           toast({
                              title: "Duplicate Images ",
                              description: "All images already exists in the album",
                              variant: "destructive",
                           });
                        } else if (res.duplicateImages.length===0){
                           toast({
                              title: "All Images Saved To Album",
                              description,
                              action: (
                                 <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                              ),
                           });
                        }else{
                           toast({
                              title: `${res.addedImages.length} Images Saved To Album`,
                              description: `${res.duplicateImages.length} images were duplicate`,
                              action: (
                                 <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                              ),
                           });
                        }
                      

                        setSelectedImages([]);
                     } catch (error) {
                        console.error("Failed to add images:", error);
                        toast({
                           title: "Error",
                           description: "Failed to save images. Please try again.",
                           variant: "destructive",
                        });
                     }
                  }}
               >

                  <div className="ml-auto">
                     <SubmitButton buttonText="Add" />
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}

export default AlbumCardList;
