"use client";
import imgs from "@/app/dune.jpg";
import { CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
function Uploadcard({ img }) {
   const [description, setDescription] = useState("Fall 2024");
   const [location, setLocation] = useState("Arrakis");
   const descriptionPlaceholder = getSeason();
   const handleLocationBlur = (e) => {
      setLocation(e.target.innerText); // Update the state with innerText
   };

   const handleDescriptionBlur = (e) => {
      setDescription(e.target.innerText); // Update the state with innerText
   };

   return (
      <div className="mx-auto bg-white rounded-lg shadow-md md:p-4 p-2 m-2 w-full max-w-xs lg:max-w-sm">
         <div className="bg-gray-200 rounded-t-lg cursor-pointer">
            <Image
               width={352}
               height={0}
               src={img || imgs}
               alt="Placeholder"
               className="w-full  h-[15rem] object-cover rounded-t-lg"
            />
         </div>
         <div className="overflow-y-auto max-h-24 mt-2">
            {/* Make location editable */}
            <CardDescription
               contentEditable
               onBlur={handleLocationBlur} // Use onBlur for location
               className="cursor-pointer"
               suppressContentEditableWarning={true} // Prevent React warning
            >
               {location ||"Beautiful World"}
            </CardDescription>

            {/* Make description editable */}
            <CardDescription
               contentEditable
               onBlur={handleDescriptionBlur} // Use onBlur for description
               className="heading cursor-pointer"
               suppressContentEditableWarning={true} // Prevent React warning
            >
               {description || descriptionPlaceholder}
            </CardDescription>

            <div className="text-xs text-gray-500 mt-4 sm:block hidden">
               By{" "}
               <span className="font-semibold hover:cursor-pointer">
                  Author Name
               </span>{" "}
               4 days ago
            </div>
         </div>
      </div>
   );
}

export default Uploadcard;