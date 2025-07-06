import { deleteManyImages, generateShareLink, saveLinkImages } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Check, CheckCheckIcon, Folder, Link, Save, Share2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LeaveDialog from "./LeaveDialog";
import LInkDialog from "./LInkDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function IconButtons({val, params,albumComponent, save, leave = true, share = true, link = true, album = true }) {

   const { selectedImages, setIsLoadingLink: setIsLoading, url, setUrl } = useUser();
   const router = useRouter();
   const { toast } = useToast();
   console.log(val,"val2");
   const iconButtonStyle = "w-16 h-16 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg";

   return (
      <>

         <div className="w-1/4 flex  gap-4 fixed bottom-4 left-[40%] z-20">
            <Card className="p-4 bg-transparent flex justify-center items-center">
               <div className="flex flex-wrap gap-4 justify-center items-center">
                  {save && (
                     <Button
                        onClick={async () => {
                         try {
                            await saveLinkImages(selectedImages, params.sharedId);
                            toast({
                               title: "Images Saved Successfully",
                               description: "Friday, February 10, 2023 at 5:57 PM",
                               action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                            });
                           //  setTimeout(() => {
                           //     router.push("/");
                           //  }, 2000);
                         } catch (error) {
                            console.error(error);
                            toast({
                               title: "Something Went Wrong ",
                               description: "Friday, February 10, 2023 at 5:57 PM",
                               action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                            });
                         }
                        }}
                        className="w-14 h-14 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg bg-red-400 hover:bg-red-600"
                     >
                        <Save className="text-white w-6 h-6" />
                     </Button>
                  )}
                  {link && (
                     <LInkDialog url={url}>
                        <DialogTrigger
                           onClick={async () => {
                              setIsLoading(true);
                              const res = await generateShareLink(val.user.id, selectedImages);
                              setUrl(res);
                              setIsLoading(false);
                           }}
                           className="w-14 h-14 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg bg-green-400 hover:bg-green-600"
                        >
                           <Link className="text-white w-6 h-6" />
                        </DialogTrigger>
                     </LInkDialog>
                  )}
                  {album && (
                     <Dialog>
                        <DialogTrigger className="w-14 h-14 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg bg-purple-400 hover:bg-purple-600">
                           <Folder className="text-white w-6 h-6" />
                        </DialogTrigger>
                        <DialogContent className="h-[40rem] overflow-auto">
                           <DialogTitle>Add To Album</DialogTitle>
                           <DialogDescription>Organize your images into an album</DialogDescription>
                           {albumComponent}
                           <DialogFooter>
                              <div className="flex mt-4 justify-end">
                                 <DialogClose className="bg-black text-white rounded-lg w-16 h-10">Done</DialogClose>
                              </div>
                         </DialogFooter>
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
                        <DialogTrigger className="w-14 h-14 flex justify-center items-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg bg-blue-400 hover:bg-blue-600">
                           <Trash className="text-white w-6 h-6" />
                        </DialogTrigger>
                     </LeaveDialog>
                  )}
               </div>
            </Card>
            <Card className="p-4 bg-transparent flex justify-center items-center">
               <Button

                  className="w-14 h-14 flex text-[2rem] justify-center items-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg bg-yellow-400 hover:bg-yellow-600 "
               >
                  <CheckCheckIcon className="text-white w-6 h-6" />
               </Button>
            </Card>


         </div></>
   );
}

export default IconButtons;
