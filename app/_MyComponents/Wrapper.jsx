"use client"
import * as faceapi from "@vladmandic/face-api"
import MainSlide from "./MainSlide"
import SideFilterLayout from "./SideFilterLayout"
import { useUser } from "../_lib/context"
import { useEffect } from "react"

function Wrapper({alc, card, searchYear, }) {
   const val = localStorage.getItem("userId")
   const { userID, setUserId } = useUser()
   useEffect(() => {
      if (val) {
         console.log(val.user);
         setUserId(val);
      }
   }, [val, setUserId]);
   useEffect
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
         <MainSlide  val={val} albumComponent={alc}  searchYear={searchYear} card={card}  />
       

         </>
   )
}

export default Wrapper
