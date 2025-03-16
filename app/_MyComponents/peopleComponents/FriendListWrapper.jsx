"use client";

import { useUser } from "@/app/_lib/context";
import SeachFriend from "./SeachFriend";
import { useEffect, useState, useMemo } from "react";
import GroupHolder from "./GroupsHolder";
import FindFriend from "./FIndFriend";

function FriendListWrapper({ res, isSelected, grpData, userId }) {
   const [searchData, setSearchData] = useState(null);
   const { joinedGroup, setJoinedGroup, isInputing, setIsInputing } = useUser();
   const abc = res.data;

   // Memoized array of group IDs to prevent unnecessary re-renders
   const arrayIds = useMemo(() => grpData.map((element) => element._id), [grpData]);

   // Update `joinedGroup` only when `arrayIds` changes
   useEffect(() => {
      if (JSON.stringify(joinedGroup) !== JSON.stringify(arrayIds)) {
         setJoinedGroup(arrayIds);
      }
   }, [arrayIds, joinedGroup, setJoinedGroup]);

   // Fetch search data only when `isInputing` is true and `searchData` is null
   useEffect(() => {
      const fetchSearchData = async () => {
         if (!isInputing) return; // Prevent unnecessary fetches

         setSearchData(null); 

         try {

            const response = await fetch(
               `http://localhost:2833/user/searchPeople?_id=${userId}&query=${isInputing}`,
               { headers: { "Content-Type": "application/json" } }
            );

            const data = await response.json();
            setSearchData(data);
         } catch (error) {
            console.error("Error fetching search data:", error);
         }
      };

      fetchSearchData();
   }, [isInputing,]); // Add query.search to dependencies


   return (
      <>
         {!isInputing &&
            grpData.map((item, i) => (
               <GroupHolder group={true} isSelected={isSelected} item={item} key={i} />
            ))}
         {!isInputing &&
            abc?.map((item, index) => <SeachFriend  item={item} key={index} />)}
         {isInputing &&searchData?.data?.map((item,index)=>{
             return <FindFriend item={item} key={index} />
         })}
         {isInputing && searchData?.groupData?.map((item, index) => {
            return <GroupHolder item={item} key={index} />
         })}
      </>
   );
}

export default FriendListWrapper;
