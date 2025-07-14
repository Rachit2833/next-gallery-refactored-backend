'use client'
import React, { createContext, useState, useContext, useRef } from "react";
import * as faceapi from "@vladmandic/face-api";
import { getLocationInfo } from "./actions";
const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [imageLeft, setImageLeft] = useState(0)
  const [imagesPasted, setImagesPasted] = useState([]);//Pasted
  const [url, setUrl] = useState(null);
  const [userID, setUserId] = useState(null)
  const [isOn, setIsOn] = useState(false);
  const [location, setLocation] = useState("Arrakis");
  const [isPending, setIsPending] = useState(false);
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)
  const [fetchedImages, setFetchedImages] = useState(null);
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
  const [isInfoOpen, setIsInfoOpen,] = useState(false)
  const [groupSelection, setGroupSelection] = useState(false);
  const [isInputing, setIsInputing] = useState(null);
  const [isOpen, setIsOpen] = useState(null)
  const [isEnabled, setIsEnabled] = useState(null);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [isTest, setIsTest] = useState(false);
  const infoRef = useRef();
  const contentRef = useRef();

  const addNewLabel = async (data) => {
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

    storedDescriptors.map((data, i) => {
      const { label, descriptors,_id } = data;
      const newLabel = `${label}/${_id}`
      if (Array.isArray(descriptors) && descriptors.length > 0) {
        const faceDescriptor = Float32Array.from(descriptors[0]);
        identifiers.push(new faceapi.LabeledFaceDescriptors(newLabel, [faceDescriptor]));
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
    const hasValidDescriptors = faceInfo.length > 0;
    const faceMatcher = hasValidDescriptors
      ? new faceapi.FaceMatcher(faceInfo)
      : null;

    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    const results = await Promise.all(
      detections.map(async (detect) => {
        if (detect) {
          console.log(detect);

          let bestMatch;
          if (faceMatcher) {
            bestMatch = faceMatcher.findBestMatch(detect.descriptor);
          }

          if (!bestMatch || bestMatch.label === "unknown") {
            const newLabelName = `Person_${Date.now()}`;
            const faceDescriptor = Array.from(detect.descriptor);

            const data = {
              label: newLabelName,
              descriptors: [faceDescriptor],
            };

            const doc = await addNewLabel(data);
            console.log(doc, "reas check");
            return doc;
          } else {
            console.log("detect known", bestMatch);
            try {
              const labelResponse = await fetch(
                `http://localhost:2833/labels/${bestMatch._label}`
              );
              if (!labelResponse.ok) {
                console.error("Error fetching label:", labelResponse.statusText);
                return;
              }
              const labelData = await labelResponse.json();
              console.log(labelData, "labelData");
              const id = labelData[0]._id;
              console.log(id);
              return id;
            } catch (error) {
              console.error("Error fetching label data:", error);
              return "Error fetching label data";
            }
          }
        }
        return "No face detected.";
      })
    );

    console.log(results); // Log all face recognition results
    return results;
  };

  function getSeason() {
    const now = new Date();
    const month = now.getMonth(); // January is 0, December is 11
    const year = now.getFullYear();
    let season;
    if (month === 11 || month <= 1) { // December, January, February
      season = "Winter";
    } else if (month >= 2 && month <= 4) { // March, April, May
      season = "Spring";
    } else if (month >= 5 && month <= 7) { // June, July, August
      season = "Summer";
    } else { // September, October, November
      season = "Fall";
    }
    return `${season} ${year}`
  }
  function getCoordinates(e) {
    e.preventDefault();
    setIsPending(true);
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
      .then(async (position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);

        const formData = new FormData();
        formData.append("location", location);
        formData.append("latitude", position.coords.latitude);
        formData.append("longitude", position.coords.longitude);

        const res = await getLocationInfo(formData);
        setLocation(`${res.city}, ${res.country}`);
        return {
          name: `${res.city}, ${res.country}`,
          coordinates: [position.coords.latitude, position.coords.longitude]
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  }
  return (
    <UserContext.Provider
      value={{
        lat,
        long,
        getCoordinates,
        getSeason,
        imagesPasted, setImagesPasted,
        isOn, setIsOn,
        imageLeft,
        setImageLeft,
        fetchedImages,
        setFetchedImages,
        url,
        setUrl,
        isLoadingLink,
        setIsLoadingLink,
        selectedImages,
        setSelectedImages,
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
        isOpen,
        setIsOpen,
        isEnabled,
        setIsEnabled,
        isTest,
        setIsTest,
        userID,
        setUserId,
        location, setLocation,
        isPending, setIsPending
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
