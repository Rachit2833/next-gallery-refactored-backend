"use client"
import MainSlide from "./MainSlide"
import SideFilterLayout from "./SideFilterLayout"
import { useUser } from "../_lib/context"
import { useEffect, useState } from "react"

function Wrapper({alc, card, params }) {
   const [val, setVal] = useState(null);
   const { setUserId } = useUser()

   useEffect(() => {
      // Access localStorage only on client side
      const storedVal = localStorage.getItem("userId");
      if (storedVal) {
         setVal(storedVal);
         setUserId(storedVal);
      }
   }, [setUserId]);

   return (
      <>
         <div className="flex items-center">
            <SideFilterLayout text="Add Images" year={params.year} />
         </div>
         <MainSlide params={params} val={val} albumComponent={alc} card={card} />
      </>
   )
}

export default Wrapper