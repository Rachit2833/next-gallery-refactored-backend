"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

import { getLocationInfo } from "../_lib/actions";

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

function PasteCardDummy({ setDrawerOpen, fileInput = true, urlBlob }) {
   const [file, setFile] = useState();
   const [location, setLocation] = useState("Arrakis");
   const descriptionPlaceholder = getSeason();
   const abc  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="


   const handleLocationBlur = (e) => {
      setLocation(e.target.value); // Update the state with value
   };

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
            setLocationData({
               Country: res.country,
               principalSubdivision: res.principalSubdivision,
            });
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => {
            setIsPending(false);
         });
   }

   return (
      <>
         <div className="mx-auto bg-[#f6f3f6] rounded-lg shadow-md md:p-4 p-2 m-2 w-full max-w-xs lg:max-w-sm">
         <div
                     style={{
                        backgroundImage: `url(${abc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                     }}
                     className="relative select-none w-full lg:h-[15rem]  sm:h-[12rem] h-[8rem] rounded-t-lg cursor-pointer overflow-hidden"
                  >
                     <Image
                        src={urlBlob}
                        alt="Placeholder"
                        fill
                        objectFit="contain"
                        className="rounded-t-lg "
                        quality={10}
                     />
                  </div>
         
            <div className="max-h-24 mt-2">
               {/* Wrap the form around the inputs and submit button */}
               <form className="grid grid-cols-6 gap-4" onSubmit={getCoordinates}>
                  <Input
                     className="heading cursor-pointer h-8 !text-[1.25rem] focus:outline-none focus:ring-0 focus:border-transparent"
                     name="LocationName"
                     readOnly
                     value={location}
                  />
               </form>

               <Input
                  name="Description"
                  readOnly
                  value={descriptionPlaceholder}
                  className="heading cursor-pointer h-8 !text-[1.25rem] focus:outline-none focus:ring-0 focus:border-transparent"
               />
               <div className="text-xs text-gray-500 mt-4 sm:block hidden">
                  By{" "}
                  <span className="font-semibold hover:cursor-pointer">
                     Author Name
                  </span>{" "}
                  4 days ago
               </div>
            </div>
         </div>
      </>
   );
}

export default PasteCardDummy;
