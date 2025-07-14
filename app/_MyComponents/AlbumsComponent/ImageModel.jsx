"use client"

import { useUser } from "@/app/_lib/context"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import image1 from "@/app/dune.jpg"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

function ImageModel() {
   const fallbackBlurredBase64 = "data:image/jpeg;base64,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"
   const abc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="
   const {
      fetchedImages,
      setFetchedImages,
      isImageOpen,
      setIsImageOpen,
      modelImages,
      setModelImages,
      imageLeft,
      setImageLeft
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