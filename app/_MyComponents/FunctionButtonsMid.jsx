import { deleteManyImages, generateShareLink, saveLinkImages } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Folder, Link, Save, Share2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LeaveDialog from "./LeaveDialog";
import LInkDialog from "./LInkDialog";
function FunctionButtonsMid() {
   const { selectedImages, setIsLoadingLink: setIsLoading, url, setUrl } = useUser();
   const router = useRouter();
   const { toast } = useToast();
   return (
      <form className="bg-gray-400 fixed bottom-8 right-4 z-10 rounded-full shadow-card flex p-1 flex-col gap-[4px] justify-center items-center w-fit">
         {save && (
            <p
               onClick={async () => {
                  await saveLinkImages(selectedImages);
                  toast({
                     title: "Images Saved Successfully",
                     description: "Friday, February 10, 2023 at 5:57 PM",
                     action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                  });
                  setTimeout(() => {
                     router.push("/");
                  }, 2000);
               }}
               className="p-2 flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110 bg-red-400 hover:bg-red-600 shadow-lg"
            >
               <Save className="text-white w-5 h-5" />
            </p>
         )}
         {share && (
            <p className="p-2 flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110 bg-yellow-400 hover:bg-yellow-600 shadow-lg">
               <Share2 className="text-white w-5 h-5" />
            </p>
         )}
         {link && (
            <LInkDialog url={url}>
               <DialogTrigger
                  onClick={async () => {
                     setIsLoading(true);
                     const res = await generateShareLink(localStorage.getItem("userId"), selectedImages);
                     setUrl(res);
                     setIsLoading(false);
                  }}
               >
                  <p className="p-2 flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110 bg-green-400 hover:bg-green-600 shadow-lg">
                     <Link className="text-white w-5 h-5" />
                  </p>
               </DialogTrigger>
            </LInkDialog>
         )}
         {album && (
            <Dialog>
               <DialogTrigger className="p-2 flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110 bg-purple-400 hover:bg-purple-600 shadow-lg">
                  <Folder className="text-white w-5 h-5" />
               </DialogTrigger>
               <DialogContent className="h-[40rem] overflow-auto">
                  <DialogTitle>Add To Album</DialogTitle>
                  <DialogDescription>Organize your images into an album</DialogDescription>
                  {albumComponent}

                  <div className="flex mt-4 justify-end">
                     <DialogClose className="bg-black text-white rounded-md w-16 h-10">Done</DialogClose>
                  </div>
               </DialogContent>
            </Dialog>
         )}
         {leave && (
            <LeaveDialog
               action={async () => {
                  await deleteManyImages(selectedImages);
               }}
               title={"Delete Image?"}
               description={"Are you sure you want to delete these images?"}
            >
               <DialogTrigger className="p-2 flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110 bg-blue-400 hover:bg-blue-600 shadow-lg">
                  <Trash className="text-white w-5 h-5" />
               </DialogTrigger>
            </LeaveDialog>
         )}
      </form>
   )
}

export default FunctionButtonsMid


