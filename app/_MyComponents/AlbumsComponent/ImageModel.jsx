"use client"

import { useUser } from "@/app/_lib/context"
import image1 from "@/app/dune.jpg"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

function ImageModel() {
   const abc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="
   const {
      fetchedImages,
      setFetchedImages,
      isImageOpen,
      setIsImageOpen,
      modelImages,
      setModelImages,
      imageLeft,
   } = useUser()

   const imageNum = fetchedImages?.indexOf(modelImages)
   const params = useSearchParams()
   const router = useRouter()
   const pathname = usePathname()
   const page = parseInt(params.get("page") || "1")

   const isBackNavigating = useRef(false)
   const isFrontNavigating = useRef(false)

   function handleParams(paramName, filter) {
      const param = new URLSearchParams(params.toString())
      param.set(paramName, filter.toString())
      router.replace(`${pathname}?${param.toString()}`, { scroll: false })
   }

   useEffect(() => {
      if (isBackNavigating.current && fetchedImages.length > 0) {
         setModelImages(fetchedImages[fetchedImages.length - 1])
         isBackNavigating.current = false
      }
      if (isFrontNavigating.current && fetchedImages.length > 0) {
         console.log("fetching updating");
         setModelImages(fetchedImages[0])
         isFrontNavigating.current = false
      }
   }, [fetchedImages])

   return (
      <>
         {isImageOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
               <div className="relative w-[80%] h-[80%] bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Close Button */}
                  <Button
                     onClick={() => setIsImageOpen(false)}
                     variant="outline"
                     className="absolute top-4 right-4 z-10"
                  >
                     Close
                  </Button>

                  {/* Forward Button */}
                  <Button
                     onClick={() => {
                        console.log(1);
                        console.log(imageNum , fetchedImages.length - 1,imageLeft);
                        if (imageNum !== fetchedImages.length-1) {
                           console.log(2);
                           setModelImages(fetchedImages[imageNum + 1])
                        } else if (imageLeft > 0) {
                           console.log(3);
                           isFrontNavigating.current = true
                           handleParams("page", page + 1)
                        }
                     }}
                     variant="outline"
                     className="absolute bottom-1/2 right-4 z-10"
                  >
                     forward
                  </Button>

                  {/* Back Button */}
                  <Button
                     onClick={() => {
                        if (imageNum !== 0) {
                           setModelImages(fetchedImages[imageNum - 1])
                        } else if (page >= 2) {
                           isBackNavigating.current = true
                           handleParams("page", page - 1)
                        }
                     }}
                     variant="outline"
                     className="absolute bottom-1/2 left-4 z-10"
                  >
                     back
                  </Button>

                  {/* Image counter */}
                  <div className="flex gap-2 text-white font-bold w-36 bg-transparent h-12 border-2 rounded-lg justify-center items-center absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                     <span className="text-center">{imageNum + 1}</span>
                     <span className="text-center">/</span>
                     <span className="text-center">{fetchedImages?.length}</span>
                  </div>

                  {/* Image Display */}
                  <AspectRatio
                     style={{
                        backgroundImage: `url(${modelImages?.blurredImage || abc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                     }}
                     ratio={16 / 9}
                     className="sm:block hidden relative w-full h-full"
                  >
                     <Image
                        priority
                        src={
                           modelImages?.ImageUrl === "https://example.com/image1.jpg"
                              ? "https://plus.unsplash.com/premium_photo-1675337267945-3b2fff5344a0?w=900&auto=format&fit=crop&q=60"
                              : modelImages?.ImageUrl || image1
                        }
                        alt="Dune"
                        fill
                        objectFit="contain"
                        className="rounded-lg"
                        placeholder="blur"
                        blurDataURL={modelImages?.blurredImage || abc}
                     />
                  </AspectRatio>

                  <AspectRatio
                     style={{
                        backgroundImage: `url(${modelImages?.blurredImage || abc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                     }}
                     ratio={1 / 8}
                     className="block sm:hidden relative w-full h-full"
                  >
                     <Image
                        priority
                        src={modelImages?.ImageUrl || image1}
                        alt="Dune"
                        fill
                        objectFit="contain"
                        className="rounded-lg"
                        placeholder="blur"
                        blurDataURL={modelImages?.blurredImage || abc}
                     />
                  </AspectRatio>
               </div>
            </div>
         ) : null}
      </>
   )
}

export default ImageModel