"use client"
import MainSlide from "./MainSlide"
import SideFilterLayout from "./SideFilterLayout"
import { useUser } from "../_lib/context"
import { useEffect, useState } from "react"

function Wrapper({alc, card, params }) {
   const [val, setVal] = useState(null);
   const { setUserId } = useUser()

   useEffect(() => {
      const storedVal = localStorage.getItem("userId");
      console.log(storedVal,"stored");
      if (storedVal) {

         setVal(storedVal);
         setUserId(storedVal);
      }
   }, [setUserId]);

   return (
      <>
         <SideFilterLayout text="Add Images" year={params.year} />
         <MainSlide params={params} val={val} albumComponent={alc||<></>} card={card} />
      </>
   )
}

export default Wrapper