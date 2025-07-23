'use client'
import React, { createContext, useState, useContext, useRef } from "react";

import { getLocationInfo } from "./actions";
import { toast } from "@/hooks/use-toast";
const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [personalDetails, setPersonalDetails] = useState(true);
  const [openCamera, setOpenCamera] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [modelType,setModelType]=useState(1)
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
    const res = await fetch('https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/labels', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json(); // Parse the JSON response
    return result.label._id;
  }
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
  const handleDownload = async () => {
    toast({
      title: "Preparing download...",
      description: "Your download will start shortly.",
    });

    try {
      saveAs(url, Date.now().toString());
      toast({
        title: "Download started!",
        description: "Your file is being downloaded.",

      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error starting your download.",

      });
    }
  };
  function getAltText(image, personalDetails = true) {
  if (!image) return "Image preview";

  const { Description, Location  } = image;
  console.log( Description, Location);
  if (personalDetails) {
    const location = Location?.name || "Unknown location";
    return `${Description || "No description"} — Taken at ${location} `;
  }

  return Description || "No description";
}
  return (
    <UserContext.Provider
      value={{
        getAltText,
        modelType,setModelType,
        handleDownload,
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
        isPending, setIsPending,
        openCamera, setOpenCamera,
         videoSrc, setVideoSrc,
         personalDetails, setPersonalDetails
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
