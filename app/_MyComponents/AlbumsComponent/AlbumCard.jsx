"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Archive, ChevronRight, CloudCog, Delete, Heart, Share2, Trash, Trash2 } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import image from "@/app/dune.jpg";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { deleteAlbumAction, generateShareLink, generateShareLinkAlbum, saveSharedAlbum } from "@/app/_lib/actions"
import { Deletebutton } from "../ImageCard"
import { useState } from "react"
import LInkDialog from "../SearchComponents/LInkDialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/app/_lib/context"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { SubmitButton } from "../SignUpForm"
import { useFormStatus } from "react-dom"

function AlbumCard({item,shared}) {
   const [isOpen, setIsOpen] = useState(false);
   const { isLoadingLink: isLoading, setIsLoadingLink: setIsLoading, selectedImages, url, setUrl, isTest, setIsTest,userID }=useUser()
      const abc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true, };
   const description = new Date().toLocaleString("en-US", options);
   const {toast}=useToast()
   async function submitDeleteForm(formData){
      await deleteAlbumAction(formData)
      setIsOpen(false)
   }
   return (
      <Card className="relative min-h-[20rem] sm:min-h-[24rem] lg:min-h-[30rem]">
         <div className="absolute z-10 top-6 sm:top-12 left-4 sm:left-8">
            <h1 className="text-[1.5rem] sm:text-[2rem] text-white">{item.Name}</h1>
            <p className="text-white mt-2 text-[1rem] sm:text-[1.2rem]">
               {item.Description}
            </p>
            <p className="text-white text-[0.9rem] sm:text-[1rem]"></p>
         </div>

         <Image
            className="rounded-xl z-0"
            src={item.ImageUrl||image}
            alt="Dune"
            layout="fill"
            objectFit="cover"
            placeholder={item.blurredImage||abc}
         />

         <div className="  absolute flex flex-row items-center justify-center gap-4 z-20 bottom-6 sm:bottom-12 right-4 sm:right-8">
            
              {!shared?
              <>
                  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                     <AlertDialogTrigger asChild className="flex items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors h-9 px-4 py-2 rounded-md">
                        <Button variant="outline"><Trash2 /></Button>
                     </AlertDialogTrigger>

                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              album from you and your friends who haven't saved the album
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <form action={submitDeleteForm} >
                              <input type="hidden" name="albumId" value={item._id} />
                              <AlertDialogCancel className=" mx-2">Cancel</AlertDialogCancel>
                              <Deletebutton />
                           </form>
                        </AlertDialogFooter>
                     </AlertDialogContent>

                  </AlertDialog>
                  <LInkDialog>
                     <DialogTrigger
                        className=" rounded-md h-9 px-4 py-2 flex items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors"
                        onClick={async () => {
                           setIsLoading(true);
                           const res = await generateShareLinkAlbum(item._id,localStorage.getItem("userId") );
                           console.log(res)
                           console.log(res,"a");
                           setUrl(res);
                           setIsLoading(false);
                        }}
                     >
                        <Share2 />
                     </DialogTrigger>
                     </LInkDialog>
                     </> : 
                     <form action={async () => {
   try {
      delete item._id;
      delete item.__v;
      console.log("Before saving album", item);
      
      const response = await saveSharedAlbum(item);
      
      console.log("Album saved successfully", response);

      toast({
         title: "Album Saved!",
         description: "Your album has been saved successfully.",
         action: <ToastAction altText="Goto schedule to undo">Done</ToastAction>,
      });
      router.push("/albums")
   } catch (error) {
      console.error("Caught Error:", error);

      toast({
         title: "Something went wrong",
         description: error.message || "An unexpected error occurred.",
         action: <ToastAction altText="Try Again">Retry</ToastAction>,
      });
   }
}} > <SubmitButtonTransparent buttonText="Save" />

               </form>}
            <Button onClick={() => router.push(`/albums/${item._id}`)} className="flex items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors">
               Visit <ChevronRight className="ml-2" />
            </Button>
         </div>
      </Card>
   )
}


export default AlbumCard
export function SubmitButtonTransparent({ size,variant,buttonText }) {
   const { pending } = useFormStatus();
   const { selectedInGroup }=useUser()

   return (
      <Button variant={variant} size={size || "default"} type="submit" className="flex items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors" disabled={pending}>
         {pending ? (
            <>
               <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </>
         ) : (
             buttonText|| "Leave"
         )}
      </Button>
   );
}
