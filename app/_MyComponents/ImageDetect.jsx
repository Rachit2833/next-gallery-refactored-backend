"use client"
import { useEffect, useState } from "react";
import ImageCard from "./ImageCard"
import Uploadcard from "./UploadCard"
import useFaceApi from "@/app/hooks/FaceApi";
import * as faceapi from "@vladmandic/face-api";
import { usePathname } from "next/navigation";
function ImageDetect({name}) {
   const [processedImages, setProcessedImages] = useState([]);
   const {isModelsLoaded,error}=useFaceApi()
   const arrayImage = [
      "/labels/Rachit/1.JPG", "/labels/Rachit/2.JPG",
      "/labels/Rohit/1.JPG", "/labels/Rohit/2.webp",
      "/labels/Virat/1.png", "/labels/Virat/2.webp",
      "/labels/Virat/3.JPG",
      "/dune.jpg"
   ];
   const pathName = usePathname();
   const id = pathName.split('/').pop(); 
   useEffect(() => {
      if (isModelsLoaded) {
         const processImages = async () => {
               let labeledDescriptors = await checkLabels();
               labeledDescriptors = labeledDescriptors.map(descriptor =>
               new faceapi.LabeledFaceDescriptors(
                  descriptor.label,
                  descriptor.descriptors.map(d => new Float32Array(d))
               )
            );

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            const results = await Promise.all(
               arrayImage.map(async (item) => {
                  const image = await faceapi.fetchImage(item);
                  const detection = await faceapi.detectSingleFace(image)
                     .withFaceLandmarks(true)
                     .withFaceDescriptor();
                  if (detection) {
                     
                     const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                     return bestMatch._label === name  ? item : null;
                  }
                  return null;
               })
            );
            setProcessedImages(results.filter((img) => img !== null));
         };
         processImages();
      }
   }, [isModelsLoaded,name]);


   const checkLabels = async () => {
      const identifiers = [];
      const response = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/label/${id}`);
      const storedDescriptors = await response.json();

      storedDescriptors.map((data, i) => {
         const { label, descriptors } = data;
         if (Array.isArray(descriptors) && descriptors.length > 0) {
            const faceDescriptor = Float32Array.from(descriptors[0]);
            identifiers.push(new faceapi.LabeledFaceDescriptors(label, [faceDescriptor]));
         }
      });

      return identifiers;
   };
  
   return (
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4 md:gap-0">
        

         {error ? (
            <div className="col-span-full text-red-600">{error}</div>
         ) : (
            processedImages.map((item, index) => (
               <ImageCard key={index} image={item} />
            ))
         )}

      </div>
   )
}

export default ImageDetect
