'use clinet'
import React, { useEffect, useState } from 'react';
import PasteCardDummy from './PasteCardDummy';
import { useUser } from '../_lib/context';

function PasteModule({additionalData=[],setFile}){
   const {imagesPasted, setImagesPasted}=useUser()
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
            setImagesPasted((prevImages) => [...prevImages, ...newImages]); // Add new images to the array
            // setImageFiles((prevFiles) => [
            //     ...prevFiles,
            //     ...newImages.map((img) => img.imageFile),
            // ]); // Add new files to array
        }
    };
    useEffect(() => {
        document.addEventListener("paste", handlePaste);
        return () => {
            document.removeEventListener("paste", handlePaste);
        };
    }, [handlePaste]);
    
    const finalImages = [...imagesPasted,...additionalData]
    console.log(finalImages);
    
const handleRemoveImage = (indexToRemove) => {
   console.log("Hello ");
   const totalImages = [...imagesPasted, ...additionalData];
   const updatedImages = totalImages.filter((_, i) => i !== indexToRemove);
   const updatedPasted = updatedImages.slice(0, imagesPasted.length);
   const updatedFiles = updatedImages.slice(imagesPasted.length);

   setImagesPasted(updatedPasted);
   setFile(updatedFiles);
};

    return (
        <>
            {finalImages?.map((item, index) => {
                return <PasteCardDummy index={index} onRemoveImage={handleRemoveImage}  key={index} urlBlob={item?.imageUrl} />
            })}
        </>
    );
};

export default PasteModule;