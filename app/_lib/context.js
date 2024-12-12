'use client'
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
const [isImageOpen, setIsImageOpen] = useState(false);
const [searchVal, setSearchVaL] = useState(null);
const [searchData, setSearchData] = useState(null);
const [queryState, setQueryState] = useState(null);
  return (
    <UserContext.Provider
      value={{
        isImageOpen,
        setIsImageOpen,
        searchVal,
        setSearchVaL,
        searchData,
        setSearchData,
        queryState,
        setQueryState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
