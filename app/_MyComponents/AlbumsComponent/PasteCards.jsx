"use client"
import { useEffect, useState } from "react";
import ImageCard from "../ImageCard";
import Uploadcard from "../UploadCard";

function PasteCards({res}) {

   const [images, setImages] = useState([]);
   const [imageFiles, setImageFiles] = useState([]);
   const arrayImage = [
      "/labels/Rachit/1.JPG", "/labels/Rachit/2.JPG",
      "/labels/Rohit/1.JPG", "/labels/Rohit/2.webp",
      "/labels/Virat/1.png", "/labels/Virat/2.webp",
      "/labels/Virat/3.JPG",
      "/dune.jpg"
   ];
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
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4 ">
         {images?.map((item, index) => (
            <Uploadcard key={index} img={item.imageUrl} />
         ))}

        {res?.map((item, index) => (
         <ImageCard key={index} image={item}  />
         ))}

      </div>
   );
}

export default PasteCards;