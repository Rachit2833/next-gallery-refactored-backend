"use client"
import { Children, use, useEffect, useState } from "react";
import ImageCard from "../ImageCard";
import Uploadcard from "../UploadCard";
import { useUser } from "@/app/_lib/context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PasteCardDummy from "../PasteCardDummy";
import SharedImageCard from "../SearchComponents/SharedImageCard";

function PasteCards({res,cod,frId,query,children}) {
   
   
   const router = useRouter();
   const searchParams = useSearchParams()
   const pathName = usePathname()
   const { searchData, setQueryState, } = useUser()
   const [images, setImages] = useState([]);
   const [imageFiles, setImageFiles] = useState([]);

   useEffect(()=>{
      if(!query){
         const params = new URLSearchParams(searchParams)
         params.delete("cod")
         params.delete("frId")
         params.delete("query")
         router.replace(`${pathName}?${params}`, { scroll: false })
      }
   },[query])
   useEffect(()=>{
      setQueryState(query)
   },[cod,frId,query])
   const handlePaste = (event) => {
      const clipboardData = event.clipboardData || window.clipboardData;
      const items = clipboardData.items;
      if (items.length === 0) {
         alert("No images Found");
         return null;
      }
      const newImages = [];

      for (const item of items) {
         if (item.type.startsWith("image/")) {
            const blob = item.getAsFile();
            const imageUrl = URL.createObjectURL(blob);
            newImages.push({ imageUrl, imageFile: blob, isAdded: false }); // Add 'isAdded' flag for each image
            console.log("Pasted image URL:", imageUrl);
         }
      }

      if (newImages.length > 0) {
         setImages((prevImages) => [...prevImages, ...newImages]); // Add new images to the array
         setImageFiles((prevFiles) => [
            ...prevFiles,
            ...newImages.map((img) => img.imageFile),
         ]); // Add new files to array
      }
   };
   useEffect(() => {
      document.addEventListener("paste", handlePaste);
      return () => {
         document.removeEventListener("paste", handlePaste);
      };
   }, [handlePaste]);
   return (
      <div className="grid md:grid-cols-3  max-h-[35rem] overflow-auto sm:grid-cols-2 grid-cols-2 gap-4 ">
           

         {images?.map((item, index) => (
            <PasteCardDummy key={index} img={item.imageUrl} />
         ))}
         {children||null}
      </div>
   );
}

export default PasteCards;