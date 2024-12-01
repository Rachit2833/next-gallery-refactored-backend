"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Archive, ChevronRight, Delete, Heart, Share2, Trash, Trash2 } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import image from "@/app/dune.jpg";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { deleteAlbumAction } from "@/app/_lib/actions"
import { Deletebutton } from "../ImageCard"
import { useState } from "react"

function AlbumCard({item}) {
   const [isOpen, setIsOpen] = useState(false);
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   function handleParams(filter) {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams);
      params.set("alb_id", filter);
      router.replace(`${pathname}?${params}`, { scroll: false });
   }
   async function submitDeleteForm(formData){
      await deleteAlbumAction(formData)
      searchParams(false)
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
            src={image}
            alt="Dune"
            layout="fill"
            objectFit="cover"
         />

         <div className="  absolute flex flex-row items-center justify-center gap-4 z-20 bottom-6 sm:bottom-12 right-4 sm:right-8">
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
            <Button className="flex items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors">
               <Share2 />
            </Button>
            <Button onClick={() => router.push(`/albums/${item._id}`)} className="flex items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors">
               Visit <ChevronRight className="ml-2" />
            </Button>
         </div>
      </Card>
   )
}


export default AlbumCard
