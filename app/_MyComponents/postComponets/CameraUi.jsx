"use client";

import image2 from "@/app/placeholder.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import * as faceapi from "@vladmandic/face-api";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FileForm from "../FileForm";
import Uploadcard from "../UploadCard";
import { Deletebutton } from "../ImageCard";
import { useUser } from "@/app/_lib/context";


function CameraUi() {
   const [openCamera, setOpenCamera] = useState(false);
   const [isDrawerOpen, setDrawerOpen] = useState(false)
   const [videoSrc, setVideoSrc] = useState(null);
   const [facingMode, setFacingMode] = useState("environment");
   const [urlBlob, setUrlBlob] = useState(null);
   const videoRef = useRef();
   const canvasRef = useRef();
   const [detected, setDetected] = useState(false);
   const { checkLabels } = useUser()



   const handleCameraClose = () => {
      if (videoSrc) {
         videoSrc.getTracks().forEach((track) => track.stop());
         setVideoSrc(null);
         setOpenCamera(false);
         setUrlBlob(null);
         const canvas = canvasRef.current;
         canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
         setDetected(false);
      }
   };

   const handleCameraOpen = async () => {
      try {

         const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
         });
         if (stream) {
            setVideoSrc(stream);
            setOpenCamera(true);
         }
      } catch (error) {
         console.error("Error accessing camera:", error);
         alert("Failed to open the camera. Please check camera permissions.");
      }
   };

   const handleSwitchCamera = async () => {
      setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
      handleCameraClose();
      await new Promise((resolve) => setTimeout(resolve, 100));
      handleCameraOpen();
   };


   const handleClick = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const pictureBlob = canvas.toDataURL("image/png");
      setUrlBlob(pictureBlob);


   };
 
   const faceRecognizer = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/weights');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/weights');
      await faceapi.nets.faceExpressionNet.loadFromUri('/weights');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights');
      
      const faceInfo = await checkLabels();
      const faceMatcher = new faceapi.FaceMatcher(faceInfo);
      console.log(faceInfo,"recognizer");
      const drawResults = async () => {
         if (videoRef.current && canvasRef.current) {
            const detections = await faceapi
               .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
               .withFaceLandmarks()
               .withFaceDescriptors()
               .withFaceExpressions();

            const canvas = canvasRef.current;
            canvas.width = videoRef?.current?.videoWidth;
            canvas.height = videoRef?.current?.videoHeight;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            detections.forEach(detection => {
               console.log(detection);
               const descriptor = detection.descriptor; // Ensure this is a Float32Array
               const bestMatch = faceMatcher.findBestMatch(descriptor);
               const box = detection.detection.box;
               const drawBox = new faceapi.draw.DrawBox(box, {
                  label: bestMatch.toString(),
               });
               drawBox.draw(canvas);
               faceapi.draw.drawFaceExpressions(canvas, [detection]);
            });

            setDetected(detections.length > 0);
            requestAnimationFrame(drawResults);
         }
      };
      drawResults();
   };

   useEffect(() => {
      if (openCamera && videoSrc) {
        faceRecognizer()
      }
   }, [openCamera]);

   useEffect(() => {
      if (videoSrc && videoRef.current) {
         videoRef.current.srcObject = videoSrc;
         videoRef.current.play();
      }
      return () => {
         handleCameraClose();
      };
   }, [videoSrc]);

   return (
      <Card className="h-[90vh] w-full">
         <CardHeader></CardHeader>
         <CardContent>
            <div className="inset-0 z-50 flex items-center justify-center">
               <div className="relative w-[80%]">
                  {openCamera && (
                     <Button
                        onClick={handleSwitchCamera}
                        variant="outline"
                        className="absolute top-4 right-4 z-10"
                     >
                        Switch
                     </Button>
                  )}
                  <div className="relative w-full h-full">
                     <AspectRatio ratio={16 / 9}>
                        {openCamera && !urlBlob ? (
                           <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              style={{
                                 width: "100%",
                                 height: "100%",
                                 objectFit: "cover",
                                 zIndex: 1,
                                 borderRadius: "0.5rem",
                              }}
                           />
                        ) : (
                           <Image
                              src={urlBlob || image2}
                              alt="Placeholder"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                           />
                        )}
                        <canvas
                           ref={canvasRef}
                           className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                        />
                     </AspectRatio>
                  </div>
               </div>
            </div>
            <div className="mt-4 flex gap-4 justify-center">
               <Button
                  onClick={() => {
                     handleCameraClose();
                     handleCameraOpen();
                     setUrlBlob(null);
                  }}
                  className={`${urlBlob ? "block" : "hidden"}`}
                  variant="outline"
               >
                  Cancel
               </Button>
               <Button
                  onClick={handleClick}
                  className={`${openCamera && !urlBlob ? "block" : "hidden"}`}
                  variant="outline"
               >
                  Capture
               </Button>
               <Button
                  onClick={!openCamera ? handleCameraOpen : handleCameraClose}
                  variant="outline"
               >
                  {!openCamera ? "Open Camera" : "Close Camera"}
               </Button>
               <Drawer open={isDrawerOpen} onOpenChange={() => setDrawerOpen(!isDrawerOpen)}>
                  <DrawerTrigger onClick={() => setDrawerOpen(true)}>
                     <span className={`${urlBlob ? "" : "hidden"} border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-lg `}>
                        Select
                     </span>
                  </DrawerTrigger>
                  <DrawerContent>
                     <div className="md:w-[30%] sm:w-[80%] w-full mx-auto">
                        <DrawerHeader >
                           <DrawerTitle className="text-center">Select Images from your Local Storage</DrawerTitle>
                           <DrawerDescription className="text-center">Description and Location can be Editable from the Input Fields Below</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                           <Uploadcard urlBlob={urlBlob}   setDrawerOpen={setDrawerOpen} fileInput={false} />
                        </DrawerFooter>
                     </div>
                  </DrawerContent>
               </Drawer>
            </div>
         </CardContent>
      </Card>
   );
}

export default CameraUi;