"use client"
import * as faceapi from "@vladmandic/face-api"
import MainSlide from "./MainSlide"
import SideFilterLayout from "./SideFilterLayout"
function Wrapper({ card, searchYear }) {
  
   const faceRecognizer = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/weights');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/weights');
      await faceapi.nets.faceExpressionNet.loadFromUri('/weights');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
   };

   faceRecognizer()
   return (
        <>
         <div className="flex items-center">

            <SideFilterLayout text="Add Images" year={searchYear} />
         </div>
         <MainSlide searchYear={searchYear} card={card}  />
       

         </>
   )
}

export default Wrapper
