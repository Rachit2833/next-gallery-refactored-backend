import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import React from "react"
import SeachFriend from "./SeachFriend"
import FriendListWrapper from "./FriendListWrapper"

async function FriendList({resGroup,searchParams,res,userId}) {
   return (
     <>
         <FriendListWrapper  userId={userId} grpData={resGroup} isSelected={searchParams.selected} res={res} />
         </>
   )
}

export default FriendList
