'use client'
import React, { createContext, useState, useContext, useRef } from "react";
import * as faceapi from "@vladmandic/face-api";
const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
const [isImageOpen, setIsImageOpen] = useState(false);
const [modelImages, setModelImages] = useState(null);
const [searchVal, setSearchVaL] = useState(null);
const [searchData, setSearchData] = useState(null);
const [queryState, setQueryState] = useState(null);
const [isSelected, setIsSelected] = useState(null);
const [activeUser, setActiveUser] = useState([]);
const [socket, setSocket] = useState(null);
const [messages, setMessages] = useState([]);
const [groupMenu, setGroupMenu] = useState(false);
const [selectedInGroup, setSelectedInGroup] = useState([]);
const [joinedGroup, setJoinedGroup] = useState([]);
const [isInfoOpen, setIsInfoOpen,]=useState(false)
const [groupSelection, setGroupSelection] = useState(false);
const [isInputing, setIsInputing] = useState(null);
 const infoRef = useRef();
 const contentRef = useRef();

 const addNewLabel=async(data)=>{
    const res = await fetch('http://localhost:2833/labels', {
       method: 'POST',
       body: JSON.stringify(data),
       headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json(); // Parse the JSON response
    return result.label._id;
}
   
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

   
const getPeopleInImage = async () => {
  const result = await detectFaceInCapturedImage(urlBlob);
  console.log(result, "ss");
  return result
};

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
                  console.log(labelData,"labelData");
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

  return (
    <UserContext.Provider
      value={{
        addNewLabel,
        checkLabels,
        detectFaceInCapturedImage,
        getPeopleInImage,
        modelImages,
        setModelImages,
        isImageOpen,
        setIsImageOpen,
        searchVal,
        setSearchVaL,
        searchData,
        setSearchData,
        queryState,
        setQueryState,
        isSelected,
        setIsSelected,
        activeUser,
        setActiveUser,
        socket,
        setSocket,
        messages,
        setMessages,
        groupMenu,
        setGroupMenu,
        selectedInGroup,
        setSelectedInGroup,
        joinedGroup,
        setJoinedGroup,
        isInfoOpen,
        setIsInfoOpen,
        infoRef,
        contentRef,
        groupSelection,
        setGroupSelection,
        isInputing,
        setIsInputing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
