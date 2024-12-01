'use client'
import React, { createContext, useState, useContext } from "react";

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext easily
export const useUser = () => useContext(UserContext);

// UserProvider component to wrap the app and provide context values
export const UserProvider = ({ children }) => {


const [isImageOpen, setIsImageOpen] = useState(false);


async function convertUrlBlobToImageFile(url, filename) {
  try {
    // Step 1: Fetch the Blob data from the URL
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob(); // Step 2: Get the Blob

    // Step 3: Create a File object from the Blob
    const file = new File([blob], filename, { type: blob.type });

    // Optional: Create an Object URL for display
    const objectUrl = URL.createObjectURL(file);

    console.log('File created:', file);
    console.log('Object URL:', objectUrl);

    // Example: Setting the Object URL to an image element
    const imgElement = document.createElement('img');
    imgElement.src = objectUrl;
    document.body.appendChild(imgElement); // Append image to the body (or any other element)

    // Remember to revoke the Object URL after use to free memory
    // URL.revokeObjectURL(objectUrl);

    return file; // Return the File object if needed
  } catch (error) {
    console.error('Error converting URL Blob to Image File:', error);
  }
}
// Function to capture the video frame

  return (
    <UserContext.Provider
      value={{
   
        
        isImageOpen,
        setIsImageOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
