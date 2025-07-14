'use client'
import ImageCard from "./ImageCard"
import SharedImageCard from "./SearchComponents/SharedImageCard"
import SearchGrid from "./SearchGrid"
import { useUser } from "../_lib/context";
import { useEffect } from "react";

function ImageWrapper({ res, cod ,left}) {
   const { fetchedImages, setFetchedImages, imageLeft, setImageLeft } = useUser()

   useEffect(() => {
      setFetchedImages(res)
      setImageLeft(left > 0 ? left :0)
   }, [res])  // Add `res` as a dependency to avoid unnecessary effect execution

   return (
      <div className="grid md:grid-cols-3  sm:grid-cols-2 grid-cols-2 gap-4 ">
         {cod ? (
            <SearchGrid />
         ) : (
            res?.map((item, index) => {
               return item.sharedBy ? (
                  <SharedImageCard sharedData={item._id} key={index} image={item} />
               ) : (
                  <ImageCard key={index} image={item} />
               );
            })
         )}
      </div>
   );
}

export default ImageWrapper;
