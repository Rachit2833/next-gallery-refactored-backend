"use client"
import * as faceapi from "@vladmandic/face-api"
import MainSlide from "./MainSlide"
import SideFilterLayout from "./SideFilterLayout"
import { useUser } from "../_lib/context"
import { useEffect } from "react"

function Wrapper({alc, card, searchYear,page }) {
   const val = localStorage.getItem("userId")
   const { userID, setUserId } = useUser()
   useEffect(() => {
      if (val) {
         console.log(val.user);
         setUserId(val);
      }
   }, [val, setUserId]);
   return (
        <>
         <div className="flex items-center">

            <SideFilterLayout text="Add Images" year={searchYear} />
         </div>
         <MainSlide  val={val} albumComponent={alc} page={page}  searchYear={searchYear} card={card}  />
       

         </>
   )
}

export default Wrapper
