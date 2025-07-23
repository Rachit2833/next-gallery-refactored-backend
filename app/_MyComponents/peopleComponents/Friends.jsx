'use client'
import { Suspense, useState } from "react";


import { useRouter } from "next/navigation";
import AvatarLoader from "../Loaders/AvatarLoader";

function Friends({children,children2}) {
   const [isExpanded, setIsExpanded] = useState(false);
   const [numImagesToShow, setNumImagesToShow] = useState(3);
   const router = useRouter()
   // const updateNumImagesToShow = () => {
   //    const width = window.innerWidth;
   //    if (width >= 1024) {
   //       setNumImagesToShow(5);
   //    } else if (width >= 640) {
   //       setNumImagesToShow(4);
   //    } else {
   //       setNumImagesToShow(3);
   //    }
   // };

   const toggleExpand = () => setIsExpanded(prev => !prev);

   // useEffect(() => {
   //    updateNumImagesToShow();
   //    window.addEventListener("resize", updateNumImagesToShow);
   //    return () => window.removeEventListener("resize", updateNumImagesToShow);
   // }, []);

   return (
      <>
         <div className={`flex justify-between mx-4 my-8`}>
            <h1>People</h1>
            <button onClick={toggleExpand} className="text-blue-500 hover:underline">
               {isExpanded ? "View Less" : "View All"}
            </button>
         </div>

         <div className={`grid lg:grid-cols-5 sm:grid-cols-4 grid-cols-2 w-full gap-4 p-4 ${isExpanded ? "hidden" : "block"}`}>
            <Suspense fallback={<AvatarLoader />} >
            {children}
            </Suspense>
         </div>

         <div className={`grid border-b-2 lg:grid-cols-5 sm:grid-cols-4 grid-cols-2 w-full gap-8 p-4 ${isExpanded ? "block" : "hidden"}`}>
            <Suspense fallback={<AvatarLoader />} >
               {children2}
            </Suspense>
         </div>
      </>
   );
}

export default Friends;

