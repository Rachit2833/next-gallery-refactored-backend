"use client"
import { useUser } from "@/app/_lib/context"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import image1 from "@/app/dune.jpg"
import Image from "next/image"
function ImageModel() {
   const { isImageOpen, setIsImageOpen } = useUser()
   return (
   
      <>
         {isImageOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-[80%] h-[80%] bg-white rounded-lg shadow-lg overflow-hidden">
               {/* Close Button */}
               <Button
                  onClick={() => setIsImageOpen(false)}
                  variant="outline"
                  className="absolute top-4 right-4 z-10"
               >
                  Close
               </Button>

               {/* Image in Modal */}
               <AspectRatio ratio={16 / 9} className=" sm:block hidden relative w-full h-full">
                  <Image
                     src={image1}
                     alt="Dune"
                     layout="fill"
                     objectFit="cover"
                     className="rounded-lg"
                  />
               </AspectRatio>
               <AspectRatio ratio={1 / 8} className=" block sm:hidden relative w-full h-full">
                  <Image
                     src={image1}
                     alt="Dune"
                     layout="fill"
                     objectFit="cover"
                     className="rounded-lg"
                  />
               </AspectRatio>


            </div>
         </div> : null}</>
   )
}

export default ImageModel

