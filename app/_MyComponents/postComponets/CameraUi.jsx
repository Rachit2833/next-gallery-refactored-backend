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

function CameraUi() {
   const [openCamera, setOpenCamera] = useState(false);
   const [videoSrc, setVideoSrc] = useState(null);
   const [facingMode, setFacingMode] = useState("environment");
   const [urlBlob, setUrlBlob] = useState(null);
   const videoRef = useRef();
   const canvasRef = useRef();
   const [detected, setDetected] = useState(false);



   const handleCameraClose = () => {
      if (videoSrc) {
         videoSrc.getTracks().forEach((track) => track.stop());
         setVideoSrc(null);
         setOpenCamera(false);
         setUrlBlob(null);
         const canvas = canvasRef.current;
         canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
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
   const handleSave = async () => {
      const result = await detectFaceInCapturedImage(urlBlob);
      console.log(result,"ss");
      await fetch('http://localhost:2833/image', {
         method: 'POST',
         body: JSON.stringify({
            "ImageUrl": "https://example.com/image1.jpg",
            "Location": "New York, USA",
            "Description": "BeautifulScene",
            People:result}),
         headers: { 'Content-Type': 'application/json' },
      });
   }

 const addNewLabel=async(data)=>{
    const res = await fetch('http://localhost:2833/labels', {
       method: 'POST',
       body: JSON.stringify(data),
       headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json(); // Parse the JSON response
    return result.label._id;
}
   const detectFaceInCapturedImage = async (imageBlob) => {
      const img = new window.Image();
      img.src = imageBlob;
      await new Promise((resolve) => (img.onload = resolve));

      const faceInfo = await checkLabels();
      const faceMatcher = new faceapi.FaceMatcher(faceInfo);

      const detections = await faceapi
         .detectAllFaces(img).withFaceLandmarks().withFaceDescriptors().withFaceExpressions();

      const results = await Promise.all(
         detections.map(async (detect) => {
            if (detect) {
               console.log(detect);
               const bestMatch = faceMatcher.findBestMatch(detect.descriptor);
               if (bestMatch.label === "unknown") {
                  const newLabelName = `Person_${Date.now()}`;
                  const faceDescriptor = Array.from(detect.descriptor);

                  const data = {
                     label: newLabelName,
                     descriptors: [faceDescriptor],
                  };

                  const doc= await addNewLabel(data); 
                  console.log(doc, "reas check");
                  return doc;
               } else {
                  console.log("detect known", bestMatch);
                  const labelResponse = await fetch(`http://localhost:2833/labels/${bestMatch._label}`);
                  if (!labelResponse.ok) {
                     console.error("Error fetching label:", labelResponse.statusText);
                     return;
                  }
                  const labelData = await labelResponse.json();
                  const id = labelData[0]._id;
                  console.log(id);
                  return id;
               }
            }
            return "No face detected.";
         })
      );

      console.log(results); // Log all face recognition results
      return results;
   };
   const checkLabels = async () => {
      const identifiers = [];
      const response = await fetch("http://localhost:2833/labels");
      const storedDescriptors = await response.json();
      console.log("Stored Descriptors:", storedDescriptors);

      storedDescriptors.map((data,i) => {
         const { label, descriptors } = data;
          console.log(label,descriptors,i,data);
         if (Array.isArray(descriptors) && descriptors.length > 0) {
            const faceDescriptor = Float32Array.from(descriptors[0]);
            identifiers.push(new faceapi.LabeledFaceDescriptors(label, [faceDescriptor]));
         }
      });

      return identifiers;
   };

   
  


   const faceRecognizer = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/weights');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/weights');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/weights');
      await faceapi.nets.faceExpressionNet.loadFromUri('/weights');
      
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
               <Drawer>
                  <DrawerTrigger>
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


                           <FileForm urlBlob={urlBlob} input={false} />

                           <Button onClick={() => {
                              handleSave()
                           }}>Submit</Button>

                           <DrawerClose >  <Button className="w-full" variant="outline">   Cancel </Button></DrawerClose>

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